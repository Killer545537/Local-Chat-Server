use anyhow::Context;
use dotenvy::dotenv;

#[derive(Clone)]
pub struct Config {
    pub database_url: String,
    pub address: String,
    pub jwt_secret: String,
}

impl Config {
    pub fn init() -> Self {
        dotenv().ok();

        Config {
            database_url: dotenvy::var("DATABASE_URL").context("Failed to get $DATABASE_URL").unwrap(),
            address: dotenvy::var("ADDRESS").context("Failed to get $ADDRESS").unwrap(),
            jwt_secret: dotenvy::var("JWT_SECRET").context("Failed to get $JWT_SECRET").unwrap(),
        }
    }
}
