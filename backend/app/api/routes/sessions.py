from fastapi import APIRouter, Query

from app.services.openf1_client import openf1_client

router = APIRouter()


@router.get("/sessions")
async def get_sessions(
    meeting_key: int = Query(..., description="OpenF1 meeting key for a Grand Prix weekend")
):
    sessions = await openf1_client.get(
        "sessions",
        params={"meeting_key": meeting_key}
    )

    cleaned_sessions = []

    for session in sessions:
        cleaned_sessions.append({
            "meeting_key": session.get("meeting_key"),
            "session_key": session.get("session_key"),
            "session_name": session.get("session_name"),
            "session_type": session.get("session_type"),
            "country_name": session.get("country_name"),
            "circuit_short_name": session.get("circuit_short_name"),
            "location": session.get("location"),
            "date_start": session.get("date_start"),
            "date_end": session.get("date_end"),
            "gmt_offset": session.get("gmt_offset"),
            "year": session.get("year"),
            "is_cancelled": session.get("is_cancelled"),
        })

    cleaned_sessions.sort(key=lambda item: item.get("date_start") or "")

    return {
        "meeting_key": meeting_key,
        "count": len(cleaned_sessions),
        "sessions": cleaned_sessions
    }