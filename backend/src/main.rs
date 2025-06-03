extern crate core;

mod api;
mod auth;
mod chat;
mod config;
mod db;
mod middleware;
mod models;

use crate::api::api::{get_messages, login, sign_up, test_connection};
use crate::config::Config;
use crate::db::db::Database;
use crate::middleware::request_logger::request_middleware;
use actix_web::middleware::from_fn;
use actix_web::web::{Data, scope};
use actix_web::{App, HttpServer, web};
use anyhow::{Context, Result, anyhow};
use dotenvy::dotenv;
use sqlx::migrate::Migrator;
use tracing::{error, info};
use crate::middleware::jwt_middleware::jwt_middleware;

static MIGRATOR: Migrator = sqlx::migrate!();

#[actix_web::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().init();
    info!("LOGGING IS WORKING FINE!");

    dotenv().ok();
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
            .wrap(from_fn(request_middleware))
            .service(test_connection)
            .service(
                scope("/api")
                    .service(scope("/auth").service(sign_up).service(login))
                    .service(scope("/protected").wrap(from_fn(jwt_middleware)).service(get_messages))
            )
    })
    .bind(&config_clone.address)?
    .run()
    .await
    .context("Failed to start an HTTP server")
}
