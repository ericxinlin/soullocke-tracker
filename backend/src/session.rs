use std::time::{Duration, Instant};

use actix::prelude::*;
use actix::{Actor, Addr};
use actix_web_actors::ws;

use crate::room::{self, ClientMessage, Connect, Disconnect, RoomRegistry};

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);

/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub struct WsSession {
    pub run_id: String,
    pub registry: Addr<RoomRegistry>,

    pub heartbeat: Instant,
}

impl WsSession {
    pub fn new(run_id: String, registry: Addr<RoomRegistry>) -> Self {
        Self {
            run_id,
            registry,
            heartbeat: Instant::now(),
        }
    }

    fn heartbeat(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.heartbeat) > CLIENT_TIMEOUT {
                println!("Websocket Client heartbeat failed, disconnecting!");
                ctx.stop();

                // don't try to send a ping
                return;
            }

            ctx.ping(b"");
        });
    }
}

impl Actor for WsSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.heartbeat(ctx);

        // register
        let recipient = ctx.address().recipient();
        self.registry.do_send(Connect {
            id_string: self.run_id.clone(),
            addr: recipient,
        });
    }

    fn stopped(&mut self, ctx: &mut Self::Context) {
        let recipient = ctx.address().recipient();
        self.registry.do_send(Disconnect {
            id_string: self.run_id.clone(),
            addr: recipient,
        });
    }
}

impl Handler<room::Message> for WsSession {
    type Result = ();

    // simply pass message to websocket
    fn handle(&mut self, msg: room::Message, ctx: &mut Self::Context) {
        ctx.text(msg.0);
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        let msg = match msg {
            Err(e) => {
                ctx.stop();
                println!("Protocol error: {e}");
                return;
            }
            Ok(msg) => msg,
        };

        match msg {
            ws::Message::Ping(msg) => {
                self.heartbeat = Instant::now();
                ctx.pong(&msg);
            }
            ws::Message::Pong(_) => {
                self.heartbeat = Instant::now();
            }
            ws::Message::Text(text) => {
                println!("Received text: {}", text);
                self.registry.do_send(ClientMessage {
                    id_string: self.run_id.clone(),
                    data: text.to_string(),
                });
            }
            ws::Message::Close(reason) => {
                println!("Connection closing: {:?}", reason);
                ctx.stop();
            }
            other => {
                println!("Unexpected payload: {other:?}");
            }
        }
    }
}
