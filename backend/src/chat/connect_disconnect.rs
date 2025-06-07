use actix::{Addr, Message};
use uuid::Uuid;
use crate::chat::websocketsession::WebSocketSession;

#[derive(Message)]
#[rtype(result = "()")]
pub struct Connect {
    pub id: Uuid,
    pub addr: Addr<WebSocketSession>
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: Uuid,
}
