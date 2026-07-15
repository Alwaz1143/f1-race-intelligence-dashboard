from typing import Optional

from fastapi import APIRouter, Query, HTTPException

from app.services.jolpica_client import jolpica_client
from app.services.openf1_client import openf1_client

router = APIRouter()


def _parse_race_key(race_key: str) -> tuple[int, int]:
    """Parse 'jolpica_{year}_{round}' into (year, round)."""
    parts = race_key.split("_")
    if len(parts) >= 3 and parts[0] == "jolpica":
        try:
            return int(parts[1]), int(parts[2])
        except (ValueError, IndexError):
            pass
    raise HTTPException(status_code=400, detail=f"Invalid race_key: {race_key}")


@router.get("/sessions")
async def get_sessions(
    meeting_key: Optional[int] = Query(None, description="OpenF1 meeting key"),
    race_key: Optional[str] = Query(None, description="Jolpica race key (jolpica_{year}_{round})"),
):
    if meeting_key:
        sessions = await openf1_client.get(
            "sessions",
            params={"meeting_key": meeting_key},
        )
        if not sessions:
            raise HTTPException(
                status_code=404,
                detail=f"No sessions found for meeting_key={meeting_key}",
            )
        cleaned = []
        for s in sessions:
            cleaned.append({
                "meeting_key": s.get("meeting_key"),
                "session_key": s.get("session_key"),
                "session_name": s.get("session_name"),
                "session_type": s.get("session_type"),
                "country_name": s.get("country_name"),
                "circuit_short_name": s.get("circuit_short_name"),
                "location": s.get("location"),
                "date_start": s.get("date_start"),
                "date_end": s.get("date_end"),
                "gmt_offset": s.get("gmt_offset"),
                "year": s.get("year"),
                "is_cancelled": s.get("is_cancelled"),
            })
        cleaned.sort(key=lambda item: item.get("date_start") or "")

        return {"meeting_key": meeting_key, "count": len(cleaned), "sessions": cleaned}

    if race_key:
        year, round_number = _parse_race_key(race_key)
        raw_data = await jolpica_client.get_race_results(year, round_number)
        race_table = raw_data.get("MRData", {}).get("RaceTable", {})
        races = race_table.get("Races", [])

        if not races:
            raise HTTPException(
                status_code=404,
                detail=f"Race not found for {race_key}",
            )

        race = races[0]
        circuit = race.get("Circuit", {})
        location = circuit.get("Location", {})

        session_key = race_key
        session = {
            "session_key": session_key,
            "session_name": "Race",
            "session_type": "Race",
            "meeting_key": None,
            "country_name": location.get("country"),
            "circuit_short_name": circuit.get("circuitName"),
            "location": location.get("locality"),
            "date_start": race.get("date"),
            "date_end": None,
            "gmt_offset": None,
            "year": int(race.get("season", year)),
            "is_cancelled": False,
        }

        return {"meeting_key": None, "count": 1, "sessions": [session]}

    raise HTTPException(
        status_code=400,
        detail="Provide either meeting_key or race_key",
    )
