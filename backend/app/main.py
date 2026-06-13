from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    health,
    races,
    sessions,
    drivers,
    laps,
    race_control,
    analytics,
    cache,
    ai_summary
)
from app.core.config import settings

app = FastAPI(
    title="F1 Race Intelligence Dashboard API",
    description="Backend API for Formula 1 race analytics, driver comparison, lap analysis, race control messages, and OpenF1 data processing.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "F1 Race Intelligence Dashboard API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }
@app.head("/")
async def root_head():
    return Response(status_code=200)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(races.router, prefix="/api", tags=["Races"])
app.include_router(sessions.router, prefix="/api", tags=["Sessions"])
app.include_router(drivers.router, prefix="/api", tags=["Drivers"])
app.include_router(laps.router, prefix="/api", tags=["Laps"])
app.include_router(race_control.router, prefix="/api", tags=["Race Control"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])
app.include_router(cache.router, prefix="/api", tags=["Cache"])
app.include_router(ai_summary.router, prefix="/api", tags=["AI Summary"])