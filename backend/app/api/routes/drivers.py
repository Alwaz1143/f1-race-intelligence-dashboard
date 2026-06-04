from fastapi import APIRouter, Query

from app.services.driver_service import get_cleaned_drivers
from app.utils.validation_utils import raise_not_found_if_empty

router = APIRouter()


@router.get("/drivers")
async def get_drivers(
    session_key: int = Query(..., description="OpenF1 session key")
):
    cleaned_drivers = await get_cleaned_drivers(session_key)

    raise_not_found_if_empty(
        cleaned_drivers,
        f"No drivers found for session_key={session_key}"
    )

    return {
        "session_key": session_key,
        "count": len(cleaned_drivers),
        "drivers": cleaned_drivers
    }