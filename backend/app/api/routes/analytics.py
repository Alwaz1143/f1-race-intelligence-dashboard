from fastapi import APIRouter, Query

from app.services.analytics_service import (
    get_bulk_analytics_data,
    get_session_overview_data,
    get_fastest_laps_leaderboard,
    compare_driver_lap_data,
)

router = APIRouter()


@router.get("/analytics/bulk")
async def get_bulk_analytics(
    session_key: int = Query(..., description="OpenF1 session key")
):
    return await get_bulk_analytics_data(session_key)


@router.get("/analytics/session-overview")
async def get_session_overview(
    session_key: int = Query(..., description="OpenF1 session key")
):
    return await get_session_overview_data(session_key)


@router.get("/analytics/fastest-laps")
async def get_fastest_laps(
    session_key: int = Query(..., description="OpenF1 session key")
):
    return await get_fastest_laps_leaderboard(session_key)


@router.get("/analytics/compare-drivers")
async def compare_drivers(
    session_key: int = Query(..., description="OpenF1 session key"),
    driver1: int = Query(..., description="First driver number"),
    driver2: int = Query(..., description="Second driver number")
):
    return await compare_driver_lap_data(
        session_key=session_key,
        driver1=driver1,
        driver2=driver2
    )