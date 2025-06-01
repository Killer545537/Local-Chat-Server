use dotenvy::dotenv;
use dotenvy_macro::dotenv;

fn main() {
    dotenv().ok();
    
    println!("{}", dotenv!("DATABASE_URL"));
}
