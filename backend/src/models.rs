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
    pub ref_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct Encounter {
    pub player_ref: String,
    pub location: String,
    pub pokemon: String,
    pub status: PokemonStatus,
    pub note: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(from = "u8", into = "u8")]
pub enum PokemonStatus {
    Captured,
    Dead,
    InTeam,
}

impl From<u8> for PokemonStatus {
    fn from(val: u8) -> Self {
        match val {
            0 => PokemonStatus::Captured,
            1 => PokemonStatus::Dead,
            2 => PokemonStatus::InTeam,
            _ => PokemonStatus::Captured,
        }
    }
}

impl From<PokemonStatus> for u8 {
    fn from(status: PokemonStatus) -> Self {
        match status {
            PokemonStatus::Captured => 0,
            PokemonStatus::Dead => 1,
            PokemonStatus::InTeam => 2,
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct UpdateRunDto {
    pub delete_encounter: Option<DeleteEncounterDto>,
    pub updated_encounter: Option<Encounter>,
    pub updated_trainer: Option<UpdateTrainerDto>,
}

#[derive(Serialize, Deserialize)]
pub struct DeleteEncounterDto {
    pub player_ref: String,
    pub location: String,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateTrainerDto {
    pub ref_id: String,
    pub name: Option<String>,
    pub trainer_id: Option<u32>,
}
