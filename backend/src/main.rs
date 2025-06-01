mod api;
mod chat;
mod config;
mod db;
mod models;

use crate::config::Config;
use crate::db::db::Database;
use actix_web::{App, HttpServer};
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
    HttpServer::new(move || App::new())
        .bind(&config.address)?
        .run()
        .await
        .context("Failed to start an HTTP server")
}
