from fastapi import APIRouter, Query
from typing import Union

from app.services.analytics_service import (
    get_bulk_analytics_data_with_fallback,
    get_session_overview_data,
    get_fastest_laps_leaderboard,
    compare_driver_lap_data,
    get_jolpica_compare_drivers,
)

router = APIRouter()


@router.get("/analytics/bulk")
async def get_bulk_analytics(
    session_key: Union[int, str] = Query(..., description="OpenF1 session key or Jolpica key (jolpica_{year}_{round})")
):
    return await get_bulk_analytics_data_with_fallback(session_key)


@router.get("/analytics/session-overview")
async def get_session_overview(
    session_key: Union[int, str] = Query(..., description="OpenF1 session key")
):
    sk = str(session_key)
    if sk.startswith("jolpica_"):
        from app.services.jolpica_analytics_service import get_jolpica_bulk_analytics
        year, round_number = int(sk.split("_")[1]), int(sk.split("_")[2])
        bulk = await get_jolpica_bulk_analytics(year, round_number)
        return bulk.get("overview", {})
    return await get_session_overview_data(session_key)


@router.get("/analytics/fastest-laps")
async def get_fastest_laps(
    session_key: Union[int, str] = Query(..., description="OpenF1 session key")
):
    sk = str(session_key)
    if sk.startswith("jolpica_"):
        from app.services.jolpica_analytics_service import get_jolpica_bulk_analytics
        year, round_number = int(sk.split("_")[1]), int(sk.split("_")[2])
        bulk = await get_jolpica_bulk_analytics(year, round_number)
        return bulk.get("fastest_laps", {})
    return await get_fastest_laps_leaderboard(session_key)


@router.get("/analytics/compare-drivers")
async def compare_drivers(
    session_key: Union[int, str] = Query(..., description="OpenF1 session key or Jolpica key"),
    driver1: int = Query(..., description="First driver number"),
    driver2: int = Query(..., description="Second driver number"),
):
    sk = str(session_key)
    if sk.startswith("jolpica_"):
        return await get_jolpica_compare_drivers(
            session_key=sk,
            driver1=driver1,
            driver2=driver2,
        )
    return await compare_driver_lap_data(
        session_key=session_key,
        driver1=driver1,
        driver2=driver2,
    )
