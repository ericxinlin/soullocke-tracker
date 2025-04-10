#![allow(dead_code)]

use actix_web::{HttpRequest, HttpResponse, Responder, body::BoxBody, http::header::ContentType};
use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct RunData {
    pub id_string: String,
    pub players: Vec<Player>,
    pub encounters: Vec<Encounter>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

impl Responder for RunData {
    type Body = BoxBody;
    fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();

        // Create response and set content type
        HttpResponse::Ok()
            .content_type(ContentType::json())
            .body(body)
    }
}

#[derive(Serialize, Deserialize)]
pub struct Player {
    pub name: String,
    pub trainer_id: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Encounter {
    pub trainer: Player,
    pub location: String,
    pub pokemon: String,
    pub status: PokemonStatus,
    pub note: String,
}

#[derive(Serialize, Deserialize)]
pub enum PokemonStatus {
    Captured,
    Dead,
    InTeam,
}
