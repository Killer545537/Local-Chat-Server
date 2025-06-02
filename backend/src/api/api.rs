use crate::auth::auth::{Token, hash_password};
use crate::config::Config;
use crate::db::db::Database;
use crate::models::models::NewUser;
use actix_web::web::{Data, Json};
use actix_web::{HttpResponse, Responder, get, post};
use serde_json::json;
use tracing::{error, info};
use validator::Validate;

#[get("/test")]
async fn test_connection() -> impl Responder {
    HttpResponse::Ok().body("Hello!")
}

#[post("/sign_up")]
async fn sign_up(
    db: Data<Database>,
    new_user: Json<NewUser>,
) -> impl Responder {
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

    let new_user = new_user.into_inner();

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
