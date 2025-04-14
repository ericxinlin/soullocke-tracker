use std::collections::HashMap;

use actix::prelude::*;

#[derive(Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

#[derive(Message)]
#[rtype(result = "()")]
pub struct Connect {
    pub id_string: String,
    pub addr: Recipient<Message>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id_string: String,
    pub addr: Recipient<Message>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientMessage {
    pub id_string: String,
    pub data: String,
}

pub struct RoomRegistry {
    pub rooms: HashMap<String, Vec<Recipient<Message>>>,
}

impl RoomRegistry {
    pub fn new() -> Self {
        println!("new room registry");
        Self {
            rooms: HashMap::new(),
        }
    }

    pub fn broadcast(&self, id_string: String, message: &str) {
        if let Some(rooms) = self.rooms.get(&id_string) {
            for session in rooms {
                session.do_send(Message(message.to_owned()));
            }
        }
    }
}

impl Actor for RoomRegistry {
    type Context = Context<Self>;
}

impl Handler<Connect> for RoomRegistry {
    type Result = ();

    fn handle(&mut self, msg: Connect, _ctx: &mut Context<Self>) {
        println!("in connect handle");
        if !self.rooms.contains_key(&msg.id_string) {
            self.rooms.insert(msg.id_string.clone(), Vec::new());
        }
        match self.rooms.get_mut(&msg.id_string) {
            Some(sessions) => sessions.push(msg.addr),
            None => {
                println!("Unexpected no room for id_string: {}", msg.id_string);
            }
        }
    }
}

impl Handler<Disconnect> for RoomRegistry {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _ctx: &mut Context<Self>) {
        if let Some(sessions) = self.rooms.get_mut(&msg.id_string) {
            sessions.retain(|val| *val != msg.addr);
            if sessions.is_empty() {
                self.rooms.remove(&msg.id_string);
            }
        }
    }
}

impl Handler<ClientMessage> for RoomRegistry {
    type Result = ();

    fn handle(&mut self, msg: ClientMessage, _ctx: &mut Context<Self>) {
        self.broadcast(msg.id_string, msg.data.as_str());
    }
}
