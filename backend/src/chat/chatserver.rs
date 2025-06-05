use crate::chat::chatmessage::ChatMessage;
use crate::chat::connect_disconnect::{Connect, Disconnect};
use crate::chat::websocketsession::WebSocketSession;
use crate::db::Database;
use crate::models::Message;
use actix::{Actor, Addr, Context as ActixContext, Handler};
use chrono::Utc;
use std::collections::HashMap;
use tracing::{error, info};
use uuid::Uuid;

#[derive(Clone)]
pub struct ChatServer {
    sessions: HashMap<Uuid, Addr<WebSocketSession>>,
    database: Database,
}

impl ChatServer {
    pub fn new(database: Database) -> Self {
        ChatServer {
            sessions: HashMap::new(),
            database,
        }
    }
}

impl Actor for ChatServer {
    type Context = ActixContext<Self>;
}

impl Handler<Connect> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: Connect, _ctx: &mut Self::Context) -> Self::Result {
        info!("User ID: {} connected", msg.id);
        self.sessions.insert(msg.id, msg.addr);
    }
}

impl Handler<Disconnect> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _ctx: &mut Self::Context) -> Self::Result {
        info!("User ID: {} disconnected", msg.id);
        self.sessions.remove(&msg.id);
    }
}

impl Handler<ChatMessage> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: ChatMessage, _ctx: &mut Self::Context) -> Self::Result {
        let timestamp = Utc::now();

        for session in self.sessions.values() {
            let _ = session.do_send(msg.clone());
        }

        let db = self.database.clone();
        let db_msg = Message {
            id: Uuid::new_v4(),
            sender_id: msg.id,
            content: msg.content,
            sent_at: timestamp,
        };

        actix::spawn(async move {
            if let Err(e) = db.save_message(db_msg).await {
                error!("Failed to save chat message: {}", e);
            }
        });
    }
}
