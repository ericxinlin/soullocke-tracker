use actix::Actor;
use actix_web::{App, HttpServer, web};
use dotenv::dotenv;
use mongodb::Client;
use room::RoomRegistry;
mod models;
mod room;
mod routes;
mod tests;

#[derive(Clone)]
struct AppState {
    mongodb_client: Client,
    db_name: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let host = std::env::var("HOST").expect("Could not load HOST env variable");

    let mongodb_uri =
        std::env::var("MONGODB_URI").expect("Could not load MONGODB_URI env variable");
    let db_name = std::env::var("DB_NAME").expect("Could not load DB_NAME env variable");
    let mongodb_client = Client::with_uri_str(mongodb_uri)
        .await
        .expect("Error connecting to MongoDB");
    let app_state = web::Data::new(AppState {
        mongodb_client,
        db_name,
    });

    let registry = RoomRegistry::new().start();

    println!("Starting server. Host: {}", host);
    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .app_data(registry.clone())
            .service(
                web::scope("/api")
                    .service(routes::ping_db)
                    .service(routes::get_run)
                    .service(routes::create_run),
            )
            .service(web::scope("/ws").service(routes::update_run))
    })
    .bind(host)?
    .run()
    .await
}
