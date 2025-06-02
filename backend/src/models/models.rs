use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;
use sqlx::types::chrono::{DateTime, Utc};
use validator::Validate;

pub struct Message {
    pub id: Uuid,
    pub sender_id: Uuid,
    pub content: String,
    pub sent_at: DateTime<Utc>,
}

#[derive(Validate, Deserialize)]
pub struct NewUser {
    #[validate(length(min = 3, max = 50, message = "Name must be between 3-50 characters"))]
    pub name: String,
    #[validate(email(message = "Invalid email format"))]
    pub email: String,
    #[validate(length(min = 8, message = "Password must be at least 8 characters"))]
    pub password: String,
}

#[derive(Serialize)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
}