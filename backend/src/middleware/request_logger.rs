use actix_web::Error;
use actix_web::body::MessageBody;
use actix_web::dev::{ServiceRequest, ServiceResponse};
use actix_web::middleware::Next;
use tracing::info;

/// Simple logger for APIs
pub async fn request_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let method = req.method().clone();
    let path = req.path().to_string();

    info!("[API/{method} {path}] API Request received");

    next.call(req).await
}
