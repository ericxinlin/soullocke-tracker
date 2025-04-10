use actix_web::{App, HttpServer, web};
use dotenv::dotenv;
use mongodb::Client;
mod models;
mod routes;

struct AppState {
    mongodb_client: Client,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let host = std::env::var("HOST").expect("Could not load HOST env variable");

    let mongodb_uri =
        std::env::var("MONGODB_URI").expect("Could not load MONGODB_URI env variable");
    let mongodb_client = Client::with_uri_str(mongodb_uri)
        .await
        .expect("Error connecting to MongoDB");
    let app_state = web::Data::new(AppState { mongodb_client });

    println!("Starting server. Host: {}", host);
    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(routes::ping_db)
            .service(routes::get_run)
    })
    .bind(host)?
    .run()
    .await
}
