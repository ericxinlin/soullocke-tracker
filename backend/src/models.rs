#![allow(dead_code)]

use actix_web::{HttpRequest, HttpResponse, Responder, body::BoxBody, http::header::ContentType};
use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct RunData {
    id_string: String,
    players: Vec<Player>,
    encounters: Vec<Encounter>,
    created_at: DateTime,
    updated_at: DateTime,
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
struct Player {
    name: String,
    trainer_id: u32,
}

#[derive(Serialize, Deserialize)]
struct Encounter {
    trainer: Player,
    location: String,
    pokemon: String,
    status: PokemonStatus,
    note: String,
}

#[derive(Serialize, Deserialize)]
enum PokemonStatus {
    Captured,
    Dead,
    InTeam,
}
