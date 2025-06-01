use sqlx::types::Uuid;
use sqlx::types::chrono::{DateTime, Utc};

pub struct Message {
    pub id: Uuid,
    pub sender_id: Uuid,
    pub content: String,
    pub sent_at: DateTime<Utc>,
}
