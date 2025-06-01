use crate::models::models::Message;
use anyhow::{Context, Result};
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::time::Duration;
use tracing::{debug, info};

pub struct Database {
    pub pool: PgPool,
}

impl Database {
    pub async fn establish_connection(database_url: &str) -> Result<Self> {
        debug!("Attempting to connect to database");

        let pool = PgPoolOptions::new()
            .max_connections(5)
            .idle_timeout(Duration::from_secs(60 * 60))
            .connect(database_url)
            .await
            .context("Failed to create database connection pool")?;

        info!("Database connection pool established successfully");
        Ok(Database { pool })
    }

    pub async fn get_messages(&self) -> Result<Vec<Message>> {
        debug!("Fetching messages from database");

        let messages = sqlx::query_as!(
            Message,
            r#"
            SELECT id, sender_id, content, sent_at
            FROM messages
            ORDER BY sent_at DESC
            "#
        )
        .fetch_all(&self.pool)
        .await
        .context("Failed to fetch messages")?;

        info!("Retrieved {} messages", messages.len());

        Ok(messages)
    }
}
