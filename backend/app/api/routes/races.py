from fastapi import APIRouter, Query
from app.services.openf1_client import openf1_client

router = APIRouter()

@router.get("/races")
async def get_races(
    year: int = Query(..., ge = 2023, description = "F1 season year")):
    meetings = await openf1_client.get(
        "meetings",
        params = {"year": year}
    )
    cleaned_races = []

    for meeting in meetings:
        cleaned_races.append({
            "meeting_key" : meeting.get("meeting_key"),
            "meeting_name": meeting.get("meeting_name"),
            "official_name": meeting.get("meeting_official_name"),
            "country_name": meeting.get("country_name"),
            "circuit_short_name": meeting.get("circuit_short_name"),
            "location": meeting.get("location"),
            "date_start": meeting.get("date_start"),
            "year": meeting.get("year"),
        })

    return {
        "year" : year,
        "count" : len(cleaned_races),
        "races" : cleaned_races
    }