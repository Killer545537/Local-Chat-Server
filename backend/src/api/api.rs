use actix_web::{HttpResponse, Responder, get, post};
use actix_web::web::Json;
use crate::models::models::NewUser;

#[get("/test")]
async fn test_connection() -> impl Responder {
    HttpResponse::Ok().body("Hello!")
}

#[post("sign_up")]
async fn sign_up(new_user: Json<NewUser>) -> impl Responder {
    
}