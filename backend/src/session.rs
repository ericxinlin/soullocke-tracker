use std::time::{Duration, Instant};

use actix::prelude::*;
use actix::{Actor, Addr};
use actix_web_actors::ws;
use mongodb::{
    Collection,
    bson::{Document, doc},
};

use crate::models::UpdateRunDto;
use crate::room::{self, ClientMessage, Connect, Disconnect, RoomRegistry};

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);

/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

#[derive(Debug)]
pub struct WsSession {
    pub run_id: String,
    pub registry: Addr<RoomRegistry>,
    pub mongodb_client: mongodb::Client,
    pub db_name: String,

    pub heartbeat: Instant,
}

impl WsSession {
    pub fn new(
        run_id: String,
        registry: Addr<RoomRegistry>,
        mongodb_client: mongodb::Client,
        db_name: String,
    ) -> Self {
        Self {
            run_id,
            registry,
            mongodb_client,
            db_name,
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
                match serde_json::from_str::<UpdateRunDto>(&text) {
                    Ok(update_dto) => {
                        let run_id = self.run_id.clone();
                        let db_client = self.mongodb_client.clone();
                        let db_name = self.db_name.clone();

                        actix::spawn(async move {
                            let db = db_client.database(&db_name);
                            let runs: Collection<Document> = db.collection("runs");

                            // delete_encounter
                            if let Some(delete_dto) = update_dto.delete_encounter {
                                println!("Deleting encounter at location: {}", delete_dto.location);
                                let filter = doc! {"id_string": &run_id};
                                let update_doc = doc! {
                                    "$pull": {"encounters": {
                                        "location": &delete_dto.location,
                                        "player_ref": &delete_dto.player_ref,
                                    }}
                                };
                                match runs.update_one(filter, update_doc).await {
                                    Ok(update_result) => {
                                        println!("Delete update result: {:?}", update_result);
                                    }
                                    Err(e) => {
                                        println!("Error deleting encounter: {}", e);
                                    }
                                }
                            }

                            // updated_encounter
                            if let Some(updated_encounter) = update_dto.updated_encounter {
                                println!(
                                    "Upserting encounter at location: {}",
                                    updated_encounter.location
                                );
                                let filter = doc! {
                                    "id_string": &run_id,
                                    "encounters": {
                                        "$elemMatch": {
                                            "location": &updated_encounter.location,
                                            "player_ref": &updated_encounter.player_ref,
                                        }
                                    }
                                };
                                let encounter_doc: Document =
                                    match mongodb::bson::to_document(&updated_encounter) {
                                        Ok(doc) => doc,
                                        Err(e) => {
                                            println!("Error serializing updated encounter: {}", e);
                                            return;
                                        }
                                    };
                                let update_doc = doc! {
                                    "$set": {"encounters.$": encounter_doc.clone()}
                                };
                                match runs.update_one(filter, update_doc).await {
                                    Ok(update_result) => {
                                        if update_result.matched_count == 0 {
                                            println!(
                                                "No matching encounter found. Inserting new encounter."
                                            );

                                            let doc_filter = doc! {"id_string": &run_id};
                                            let push_update = doc! {
                                                "$push": {"encounters": &encounter_doc}
                                            };

                                            match runs.update_one(doc_filter, push_update).await {
                                                Ok(push_result) => {
                                                    println!("Push result: {:?}", push_result);
                                                }
                                                Err(e) => {
                                                    println!("Error pushing new encounter: {}", e);
                                                }
                                            }
                                        } else {
                                            println!("Update result: {:?}", update_result);
                                        }
                                    }
                                    Err(e) => {
                                        println!("Error updating encounter: {}", e);
                                    }
                                }
                            }

                            // updated_trainer
                            if let Some(updated_trainer) = update_dto.updated_trainer {
                                println!(
                                    "Updating trainer with ref_id: {}",
                                    updated_trainer.ref_id
                                );
                                let filter = doc! {
                                    "id_string": &run_id,
                                    "players": {
                                        "$elemMatch": {
                                            "ref_id": &updated_trainer.ref_id,
                                        }
                                    }
                                };
                                let trainer_doc: Document =
                                    match mongodb::bson::to_document(&updated_trainer) {
                                        Ok(doc) => doc,
                                        Err(e) => {
                                            println!("Error serializing updated trainer: {}", e);
                                            return;
                                        }
                                    };
                                let update_doc = doc! {
                                    "$set": {"players.$": trainer_doc.clone()}
                                };
                                match runs.update_one(filter, update_doc).await {
                                    Ok(update_result) => {
                                        println!("Update result: {:?}", update_result);
                                    }
                                    Err(e) => {
                                        println!("Error updating trainer: {}", e);
                                    }
                                }
                            }
                        });
                    }
                    Err(e) => {
                        println!("Failed to parse update_dto: {}", e);
                    }
                }

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
