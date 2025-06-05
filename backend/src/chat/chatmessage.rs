use actix::Message;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Message, Serialize, Deserialize, Clone)]
#[rtype(result = "()")]
pub struct ChatMessage {
    pub id: Uuid,
    pub content: String,
}