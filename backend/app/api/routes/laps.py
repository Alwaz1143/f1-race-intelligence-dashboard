from fastapi import APIRouter, Query

from app.services.lap_service import get_cleaned_laps

router = APIRouter()


@router.get("/laps")
async def get_laps(
    session_key: int = Query(..., description="OpenF1 session key"),
    driver_number: int | None = Query(
        default=None,
        description="Optional driver number. If not provided, returns laps for all drivers."
    )
):
    cleaned_laps = await get_cleaned_laps(
        session_key=session_key,
        driver_number=driver_number
    )

    if not cleaned_laps:
        return {
            "session_key": session_key,
            "driver_number": driver_number,
            "count": 0,
            "laps": [],
            "message": "No laps found for the selected session or driver."
        }

    return {
        "session_key": session_key,
        "driver_number": driver_number,
        "count": len(cleaned_laps),
        "laps": cleaned_laps
    }