use dotenvy_macro::dotenv;

#[derive(Clone)]
pub struct Config {
    pub database_url: String,
    pub address: String,
    pub jwt_secret: String,
}

impl Config {
    pub fn init() -> Self {
        Config {
            database_url: dotenv!("DATABASE_URL").to_string(),
            address: dotenv!("ADDRESS").to_string(),
            jwt_secret: dotenv!("JWT_SECRET").to_string(),
        }
    }
}
