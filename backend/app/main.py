from fastapi import FastAPI 
from app.api.routes import health, races


app = FastAPI(
    title = "F1 Race Intelligence Dashboard API",
    version = "1.0.0",
)
app.include_router(health.router, prefix = "/api")
app.include_router(races.router, prefix = "/api")
