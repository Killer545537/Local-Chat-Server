use crate::auth::auth::Token;
use crate::config::Config;
use crate::models::models::AuthenticatedUser;
use actix_web::body::MessageBody;
use actix_web::dev::{ServiceRequest, ServiceResponse};
use actix_web::middleware::Next;
use actix_web::{Error, HttpMessage};
use actix_web::web::Data;
use tracing::{debug, error};

pub async fn jwt_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    if let Some(config) = req.app_data::<Data<Config>>() {
        let token_manager = Token::new(config.jwt_secret.clone());

        if let Some(token) = Token::extract_token_from_cookie(req.request()) {
            debug!("Found auth token in request cookies");

            match token_manager.validate_token(&token) {
                Ok(claims) => match Token::get_user_id_from_claims(&claims) {
                    Ok(user_id) => {
                        debug!(user_id = %user_id, "Successfully authenticated user");

                        req.extensions_mut().insert(AuthenticatedUser {
                            id: user_id,
                            name: claims.name,
                        });
                    }
                    Err(e) => {
                        error!("Invalid user ID in token: {}", e);
                    }
                },
                Err(e) => {
                    debug!("Token validation failed: {}", e);
                }
            }
        }
    }

    next.call(req).await
}
