from fastapi import APIRouter, Query

from app.services.jolpica_client import jolpica_client
from app.services.openf1_client import openf1_client

router = APIRouter()


def _normalize_jolpica_race(raw: dict) -> dict:
    circuit = raw.get("Circuit", {})
    location_data = circuit.get("Location", {})
    season = raw.get("season")
    race_round = raw.get("round")

    return {
        "race_key": f"jolpica_{season}_{race_round}",
        "meeting_name": raw.get("raceName"),
        "official_name": raw.get("raceName"),
        "country_name": location_data.get("country"),
        "circuit_short_name": circuit.get("circuitName"),
        "location": location_data.get("locality"),
        "date_start": raw.get("date"),
        "year": int(season) if season else None,
        "round": int(race_round) if race_round else None,
        "meeting_key": None,
        "has_sessions": False,
    }


@router.get("/races")
async def get_races(
    year: int = Query(..., ge=1950, description="F1 season year"),
):
    raw_data = await jolpica_client.get_race_list(year)
    race_table = raw_data.get("MRData", {}).get("RaceTable", {})
    raw_races = race_table.get("Races", [])

    races = [_normalize_jolpica_race(r) for r in raw_races]

    if year >= 2023:
        try:
            meetings = await openf1_client.get("meetings", params={"year": year})
            key_by_name = {}
            for m in meetings:
                name = m.get("meeting_name", "").lower().strip()
                key_by_name[name] = m.get("meeting_key")

            for race in races:
                name = (race["meeting_name"] or "").lower().strip()
                mk = key_by_name.get(name)
                if mk:
                    race["meeting_key"] = mk
                    race["has_sessions"] = True
        except Exception:
            pass

    valid_races = [r for r in races if r["meeting_name"]]

    return {
        "year": year,
        "count": len(valid_races),
        "races": valid_races,
    }
