use tracing::error;
use serde_json::json;
use tracing::info;
use crate::chat::chatmessage::ChatMessage;
use crate::chat::chatserver::ChatServer;
use crate::chat::connect_disconnect::{Connect, Disconnect};
use actix::{Actor, Addr, AsyncContext, Handler, StreamHandler};
use actix_web_actors::ws::{Message as WsMessage, ProtocolError, WebsocketContext};
use uuid::Uuid;

pub struct WebSocketSession {
    pub id: Uuid,
    pub addr: Addr<ChatServer>,
}

impl Actor for WebSocketSession {
    type Context = WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.addr.do_send(Connect {
            id: self.id,
            addr: ctx.address(),
        });
    }

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        self.addr.do_send(Disconnect { id: self.id })
    }
}

impl Handler<ChatMessage> for WebSocketSession {
    type Result = ();

    fn handle(&mut self, msg: ChatMessage, ctx: &mut Self::Context) -> Self::Result {
        let message = serde_json::to_string(&msg).unwrap();
        ctx.text(message);
    }
}

impl StreamHandler<Result<WsMessage, ProtocolError>> for WebSocketSession {
    fn handle(&mut self, msg: Result<WsMessage, ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(WsMessage::Text(text)) => {
                // Log the received message
                info!("Received message: {}", text);

                if let Ok(chat_msg) = serde_json::from_str::<ChatMessage>(&text) {
                    // Send to chat server for broadcasting and database saving
                    self.addr.do_send(chat_msg.clone());

                    // Immediately acknowledge receipt to the sender
                    if let Ok(response) = serde_json::to_string(&json!({
                        "status": "received",
                        "message": chat_msg
                    })) {
                        ctx.text(response);
                    }
                } else {
                    // Send parsing error back to client
                    error!("Failed to parse message: {}", text);
                    ctx.text(r#"{"error":"Invalid message format"}"#);
                }
            }
            Ok(WsMessage::Ping(msg)) => ctx.pong(&msg),
            _ => (),
        }
    }
}
