extern crate core;

mod api;
mod auth;
mod chat;
mod config;
mod db;
mod middleware;
mod models;

use actix::Actor;
use crate::api::{get_messages, login, sign_up, test_connection, websocket_route};
use crate::chat::chatserver::ChatServer;
use crate::config::Config;
use crate::db::Database;
use crate::middleware::jwt_middleware::jwt_middleware;
use crate::middleware::request_logger::request_middleware;
use actix_cors::Cors;
use actix_web::http::header;
use actix_web::middleware::from_fn;
use actix_web::web::{Data, scope};
use actix_web::{App, HttpServer};
use actix_web_nextjs::spa;
use anyhow::{Context, Result, anyhow};
use sqlx::migrate::Migrator;
use tracing::{error, info};

static MIGRATOR: Migrator = sqlx::migrate!();

#[actix_web::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().init();
    info!("LOGGING IS WORKING FINE!");

    info!("DATABASE VARIABLES LOADED!");

    let config = Config::init();
    let config_clone = config.clone();

    let db = match Database::establish_connection(&config.database_url).await {
        Ok(db) => {
            info!("Connection to database successful");
            db
        }
        Err(err) => {
            error!("Failed to connect to database: {}", err);
            return Err(anyhow!("Database connection failed"));
        }
    };

    let chat_server = ChatServer::new(db.clone()).start();

    MIGRATOR
        .run(&db.pool)
        .await
        .context("Failed to run database migrations")?;
    info!("Database migrations completed successfully");

    info!("Starting HTTP server at {}", config.address);
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(db.clone()))
            .app_data(Data::new(config.clone()))
            .app_data(Data::new(chat_server.clone()))
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allowed_methods(vec!["GET", "POST", "OPTIONS", "CONNECT"])
                    .allowed_headers(vec![
                        header::AUTHORIZATION,
                        header::CONTENT_TYPE,
                        header::UPGRADE,
                        header::CONNECTION,
                        header::SEC_WEBSOCKET_KEY,
                        header::SEC_WEBSOCKET_VERSION,
                        header::SEC_WEBSOCKET_PROTOCOL,
                        header::SEC_WEBSOCKET_EXTENSIONS,
                    ])
                    .supports_credentials(),
            )
            .service(websocket_route)
            .wrap(from_fn(request_middleware))
            .service(test_connection)
            .service(
                scope("/api")
                    .service(scope("/auth").service(sign_up).service(login))
                    .service(
                        scope("/protected")
                            .wrap(from_fn(jwt_middleware))
                            .service(get_messages),
                    ),
            )
            .service(
                spa()
                    .index_file("../frontend/out/index.html")
                    .static_resources_mount("/")
                    .static_resources_location("../frontend/out")
                    .finish(),
            )
    })
    .bind(&config_clone.address)?
    .run()
    .await
    .context("Failed to start an HTTP server")
}
