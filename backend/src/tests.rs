#[cfg(test)]
mod test {
    use crate::AppState;
    use crate::models;
    use crate::room::RoomRegistry;
    use crate::routes;
    use actix::Actor;
    use actix_web::{App, test, web};
    use dotenv::dotenv;
    use mongodb::{
        Client, Collection,
        bson::{Document, doc},
        options::ClientOptions,
    };

    async fn setup_app_state() -> AppState {
        dotenv().ok();
        let mongodb_uri = std::env::var("MONGODB_URI").unwrap();
        // Connect to MongoDB (adjust the URI if needed)
        let client_options = ClientOptions::parse(mongodb_uri)
            .await
            .expect("Failed to parse MongoDB URI");
        let client =
            Client::with_options(client_options).expect("Failed to initialize MongoDB client");
        // Clean the test database
        client
            .database("data_test")
            .drop()
            .await
            .expect("Failed to drop test database");

        let registry = RoomRegistry::new().start();

        AppState {
            mongodb_client: client,
            db_name: "data_test".to_string(),
            registry,
        }
    }

    #[actix_web::test]
    async fn test_create_run() {
        // Setup shared state with the test database name "data_test"
        let state = setup_app_state().await;

        // Build Actix App with the create_run service.
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(state.clone()))
                .service(routes::create_run),
        )
        .await;

        // Call the POST /createrun route.
        let req = test::TestRequest::post().uri("/createrun").to_request();
        let resp = test::call_service(&app, req).await;
        assert!(
            resp.status().is_success(),
            "Expected successful response from create_run"
        );

        // Get the randomly generated run id from the response body.
        let body = test::read_body(resp).await;
        let run_id = String::from_utf8(body.to_vec()).expect("Response was not valid UTF-8");
        assert!(!run_id.is_empty(), "Expected a non-empty run id");

        // Now connect to the MongoDB test database and verify the document exists.
        let client = state.mongodb_client;
        let db = client.database("data_test");
        let runs: Collection<Document> = db.collection("runs");

        let filter = doc! { "id_string": &run_id };
        let found_doc = runs
            .find_one(filter)
            .await
            .expect("Failed to query database");

        assert!(
            found_doc.is_some(),
            "Database should contain a document with the run id: {}",
            run_id
        );
    }

    #[actix_web::test]
    async fn test_get_run() {
        // Setup shared app state using the test database "data_test"
        let state = setup_app_state().await;

        // Build Actix App with both the create_run and get_run services.
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(state.clone()))
                .service(routes::create_run)
                .service(routes::get_run),
        )
        .await;

        // Create a run with POST /createrun
        let create_req = test::TestRequest::post().uri("/createrun").to_request();
        let create_resp = test::call_service(&app, create_req).await;
        assert!(
            create_resp.status().is_success(),
            "Expected successful response from create_run"
        );

        // Extract the run id from the response body.
        let create_body = test::read_body(create_resp).await;
        let run_id = String::from_utf8(create_body.to_vec()).expect("Response was not valid UTF-8");
        assert!(!run_id.is_empty(), "Expected a non-empty run id");

        // Retrieve the run data with GET /run/{run_id}
        let get_uri = format!("/run/{}", run_id);
        let get_req = test::TestRequest::get().uri(&get_uri).to_request();
        let get_resp = test::call_service(&app, get_req).await;
        assert!(
            get_resp.status().is_success(),
            "Expected successful response from get_run"
        );

        let get_body = test::read_body(get_resp).await;
        // Deserialize the response JSON into RunData.
        let run_data: models::RunData =
            serde_json::from_slice(&get_body).expect("Failed to deserialize RunData from response");
        // Check if the returned id matches the created run id.
        assert_eq!(run_data.id_string, run_id, "Returned run id did not match");
    }
}
