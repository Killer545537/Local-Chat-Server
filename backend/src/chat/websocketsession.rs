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
        self.addr.do_send(Disconnect { id: self.id})
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
    fn handle(&mut self, msg: Result<WsMessage, ProtocolError>, _ctx: &mut Self::Context) {
        if let Ok(WsMessage::Text(text)) = msg {
            self.addr.do_send(ChatMessage {
                id: self.id,
                content: text.to_string(),
            })
        }
    }
}