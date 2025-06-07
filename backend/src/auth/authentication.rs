use actix_web::HttpRequest;
use anyhow::{Context, Result};
use bcrypt::{DEFAULT_COST, hash, verify};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use sqlx::types::chrono::Utc;
use std::time::Duration;
use uuid::Uuid;

const EXPIRATION_TIMER: Duration = Duration::from_secs(60 * 60);

pub fn hash_password(password: String) -> Result<String> {
    hash(password, DEFAULT_COST).context("Failed to hash password")
}

pub fn verify_password(password: &str, hash: &str) -> Result<bool> {
    verify(password, hash).context("Failed to verify password")
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub name: String,
    pub exp: usize,
    pub iat: usize,
}

pub struct Token {
    secret: String,
}

impl Token {
    pub fn new(secret: String) -> Self {
        Token { secret }
    }

    pub fn generate(&self, user_id: Uuid, name: String) -> Result<String> {
        let now = Utc::now();
        let exp = now + EXPIRATION_TIMER;

        let claims = Claims {
            sub: user_id.to_string(),
            name,
            exp: exp.timestamp() as usize,
            iat: now.timestamp() as usize,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )
        .context("Failed to create token")
    }

    pub fn validate_token(&self, token: &str) -> Result<Claims> {
        let validation = Validation::default();
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_bytes()),
            &validation,
        )
        .context("Invalid token")?;

        Ok(token_data.claims)
    }

    pub fn get_user_id_from_claims(claims: &Claims) -> Result<Uuid> {
        Uuid::parse_str(&claims.sub).context("Invalid user ID in token")
    }

    pub fn extract_token_from_cookie(req: &HttpRequest) -> Option<String> {
        req.cookie("auth_token")
            .map(|cookie| cookie.value().to_string())
    }
}
