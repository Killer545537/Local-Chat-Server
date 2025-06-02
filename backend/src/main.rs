extern crate core;

mod api;
mod auth;
mod chat;
mod config;
mod db;
mod middleware;
mod models;

use crate::api::api::test_connection;
use crate::config::Config;
use crate::db::db::Database;
use crate::middleware::request_logger::request_middleware;
use actix_web::middleware::from_fn;
use actix_web::{App, HttpServer, web};
use anyhow::{Context, Result, anyhow};
use dotenvy::dotenv;
use sqlx::migrate::Migrator;
use tracing::{error, info};

static MIGRATOR: Migrator = sqlx::migrate!();

#[actix_web::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().init();
    info!("LOGGING IS WORKING FINE!");

    dotenv().ok();
    info!("DATABASE VARIABLES LOADED!");

    let config = Config::init();

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
            .wrap(from_fn(request_middleware))
            .service(web::scope("/api").service(test_connection))
    })
    .bind(&config.address)?
    .run()
    .await
    .context("Failed to start an HTTP server")
}
