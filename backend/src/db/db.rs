use crate::models::models::{Message, NewUser, User};
use anyhow::{Context, Result, anyhow};
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::time::Duration;
use tracing::{debug, error, info};

#[derive(Clone)]
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

    pub async fn add_user(&self, new_user: NewUser) -> Result<User> {
        debug!("Creating user with email: {}", new_user.email);

        let result = sqlx::query_as!(
            User,
            r#"
            INSERT INTO users(name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email
            "#,
            new_user.name,
            new_user.email,
            new_user.password,
        )
        .fetch_one(&self.pool)
        .await;

        match result {
            Ok(user) => {
                info!(user_id = %user.id, "Successfully created new user");
                Ok(user)
            }
            Err(err) => {
                if let Some(db_err) = err.as_database_error() {
                    if db_err.code().as_deref() == Some("23505") {
                        return Err(anyhow!("user_already_exists"));
                    }
                }

                error!("Database error while creating user: {}", err);
                Err(anyhow!("Failed to insert user"))
            }
        }
    }
}
