use crate::AppState;
use crate::models;
use actix_web::{Either, HttpResponse, get, post, web};
use mongodb::{
    Collection, bson,
    bson::{Document, doc},
};
use rand::Rng;
use random_word::Lang;

#[post("/createrun")]
pub async fn create_run(data: web::Data<AppState>) -> Either<String, HttpResponse> {
    let db = data.mongodb_client.database("data");
    let runs: Collection<Document> = db.collection("runs");
    let mut potential_id: String;
    loop {
        let word1 = random_word::get(Lang::En);
        let word2 = random_word::get(Lang::En);
        let num = rand::random_range(0..=99);
        potential_id = format!("{0}-{1}-{2}", word1, word2, num);
    }

    Either::Right(HttpResponse::NotImplemented().finish())
}

#[get("/run/{run_id}")]
pub async fn get_run(
    data: web::Data<AppState>,
    path: web::Path<String>,
) -> Either<models::RunData, HttpResponse> {
    let db = data.mongodb_client.database("data");
    let runs: Collection<Document> = db.collection("runs");
    let run_id: String = path.to_string();

    let db_res = runs.find_one(doc! {"id_string": &run_id}).await;

    let res: Result<models::RunData, HttpResponse> = db_res
        .map_err(|_| HttpResponse::InternalServerError().body("Database get run failed"))
        .and_then(|option_doc| {
            option_doc.ok_or_else(|| {
                HttpResponse::NotFound()
                    .body(format!("Could not find run with id string: {}", run_id))
            })
        })
        .and_then(|doc| {
            bson::from_document(doc).map_err(|e| {
                HttpResponse::InternalServerError()
                    .body(format!("Failed to deserialize run: {}", e))
            })
        });

    match res {
        Ok(data) => Either::Left(data),
        Err(e) => Either::Right(e),
    }

    // match res {
    //     Err(_) => Either::Left(HttpResponse::InternalServerError().body("Database get run failed")),
    //     Ok(result) => match result {
    //         None => Either::Left(
    //             HttpResponse::NotFound()
    //                 .body(format!("Could not find run with id string: {}", run_id)),
    //         ),
    //         Some(doc) => {
    //             let run_data: Result<models::RunData, _> = bson::from_document(doc);
    //             match run_data {
    //                 Ok(data) => Either::Right(data),
    //                 Err(e) => Either::Left(
    //                     HttpResponse::InternalServerError()
    //                         .body(format!("Failed to deserialize run: {}", e)),
    //                 ),
    //             }
    //         }
    //     },
    // }
}

#[get("/pingdb")]
pub async fn ping_db(data: web::Data<AppState>) -> HttpResponse {
    let res = data.mongodb_client.list_databases().await;

    match res {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::ServiceUnavailable().finish(),
    }
}
