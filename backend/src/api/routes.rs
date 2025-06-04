use crate::auth::{Token, hash_password};
use crate::config::Config;
use crate::db::Database;
use crate::models::{AuthenticatedUser, LoginPayload, NewUser};
use actix_web::cookie::time::Duration;
use actix_web::cookie::{Cookie, SameSite};
use actix_web::web::{Data, Json};
use actix_web::{HttpMessage, HttpRequest, HttpResponse, Responder, get, post};
use serde_json::json;
use tracing::{error, info};
use validator::Validate;

#[get("/test")]
async fn test_connection() -> impl Responder {
    HttpResponse::Ok().body("Hello!")
}

#[post("/sign_up")]
async fn sign_up(db: Data<Database>, Json(mut new_user): Json<NewUser>) -> impl Responder {
    if let Err(errors) = new_user.validate() {
        error!("User validation failed: {:?}", errors);
        return HttpResponse::BadRequest().json(errors.to_string());
    }

    let hashed_password = match hash_password(new_user.password.clone()) {
        Ok(hash) => hash,
        Err(e) => {
            error!("Password hashing failed: {}", e);
            return HttpResponse::InternalServerError().body("Failed to process registration");
        }
    };

    new_user.password = hashed_password;

    match db.add_user(new_user.clone()).await {
        Ok(user) => HttpResponse::Created().json(user),
        Err(e) => {
            let err_msg = e.to_string();
            if err_msg.contains("user_already_exists") {
                error!(
                    "Registration failed: email: {} already exists",
                    new_user.email
                );
                return HttpResponse::Conflict().json(json!({
                    "error": "email_already_exists",
                    "message": "This email is already registered"
                }));
            }

            error!("User creation failed: {}", e);
            HttpResponse::InternalServerError().body("Failed to register user")
        }
    }
}

#[post("/login")]
async fn login(
    db: Data<Database>,
    config: Data<Config>,
    login_payload: Json<LoginPayload>,
) -> impl Responder {
    match db.check_user(login_payload.into_inner()).await {
        Ok(user) => {
            let token_manager = Token::new(config.jwt_secret.clone());

            match token_manager.generate(user.id, user.name.clone()) {
                Ok(token) => {
                    info!(user_id = %user.id, "Login successful, token generated");

                    // Create cookie with the token
                    let cookie = Cookie::build("auth_token", token)
                        .path("/")
                        .http_only(true)
                        .secure(true)
                        .same_site(SameSite::Strict)
                        .max_age(Duration::hours(1))
                        .finish();

                    HttpResponse::Ok().cookie(cookie).json(json!({
                        "status": "success",
                        "user": {
                            "id": user.id,
                            "name": user.name,
                            "email": user.email
                        }
                    }))
                }
                Err(e) => {
                    error!("Token generation failed: {}", e);
                    HttpResponse::InternalServerError().json(json!({
                        "error": "Failed to generate authentication token"
                    }))
                }
            }
        }
        Err(e) => {
            let error_message = e.to_string();
            error!("Login failed: {}", error_message);

            if error_message.contains("User not found")
                || error_message.contains("Invalid password")
            {
                HttpResponse::Unauthorized().json(json!({
                    "error": "Invalid email or password"
                }))
            } else {
                HttpResponse::InternalServerError().json(json!({
                    "error": "Authentication failed"
                }))
            }
        }
    }
}

#[get("/messages")]
async fn get_messages(req: HttpRequest, db: Data<Database>) -> impl Responder {
    /*
    This has to be done because the previous code
    ```
    if let Some(user) = req.extensions().get::<AuthenticatedUser>() 
    ```
    had a warning `this RefCell reference is held across an await point`.
    This means that a reference that was borrowed was kept alive while hitting an `.await`.
    This is unsafe since .await can yield control, and the borrow checker can't guarantee that `RefCell`'s borrow rules are upheld
     */
    let user = {
        let extensions = req.extensions();
        extensions.get::<AuthenticatedUser>().cloned()
    };
    if let Some(user) = user {
        info!(
            user_id = user.id.to_string(),
            "Authenticated user requesting messages"
        );

        match db.get_messages().await {
            Ok(messages) => HttpResponse::Ok().json(json!({
                "messages": messages,
                "retrieved_by": {
                    "user_id": user.id,
                    "name": user.name
                }
            })),
            Err(e) => {
                error!("Failed to retrieve messages: {}", e);
                HttpResponse::InternalServerError().json(json!({
                    "error": "Failed to retrieve messages"
                }))
            }
        }
    } else {
        error!("Unauthenticated request reached protected endpoint");
        HttpResponse::Unauthorized().json(json!({
            "error": "Authentication required"
        }))
    }
}
