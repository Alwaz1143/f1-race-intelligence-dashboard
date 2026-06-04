from fastapi import APIRouter, Query

from app.services.race_control_service import (
    get_cleaned_race_control_messages,
    get_race_control_counts
)

router = APIRouter()


@router.get("/race-control")
async def get_race_control_messages(
    session_key: int = Query(..., description="OpenF1 session key")
):
    cleaned_messages = await get_cleaned_race_control_messages(session_key)

    event_counts = get_race_control_counts(cleaned_messages)

    return {
        "session_key": session_key,
        "count": len(cleaned_messages),
        "event_counts": event_counts,
        "messages": cleaned_messages
    }