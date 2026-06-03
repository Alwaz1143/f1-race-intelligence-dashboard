from collections import Counter
from fastapi import APIRouter, Query

from app.services.openf1_client import openf1_client

router = APIRouter()


def format_lap_time(seconds: float | None):
    if seconds is None:
        return None

    minutes = int(seconds // 60)
    remaining_seconds = seconds - (minutes * 60)

    return f"{minutes}:{remaining_seconds:06.3f}"


@router.get("/analytics/session-overview")
async def get_session_overview(
    session_key: int = Query(..., description="OpenF1 session key")
):
    sessions = await openf1_client.get(
        "sessions",
        params={"session_key": session_key}
    )

    drivers = await openf1_client.get(
        "drivers",
        params={"session_key": session_key}
    )

    laps = await openf1_client.get(
        "laps",
        params={"session_key": session_key}
    )

    race_control_messages = await openf1_client.get(
        "race_control",
        params={"session_key": session_key}
    )

    session_info = sessions[0] if sessions else None

    driver_numbers = {
        driver.get("driver_number")
        for driver in drivers
        if driver.get("driver_number") is not None
    }

    valid_laps = [
        lap for lap in laps
        if lap.get("lap_duration") is not None
    ]

    lap_numbers = [
        lap.get("lap_number")
        for lap in laps
        if lap.get("lap_number") is not None
    ]

    fastest_lap = None

    if valid_laps:
        fastest_lap_data = min(
            valid_laps,
            key=lambda lap: lap.get("lap_duration")
        )

        fastest_lap = {
            "driver_number": fastest_lap_data.get("driver_number"),
            "lap_number": fastest_lap_data.get("lap_number"),
            "lap_duration": fastest_lap_data.get("lap_duration"),
            "lap_time_formatted": format_lap_time(
                fastest_lap_data.get("lap_duration")
            ),
            "date_start": fastest_lap_data.get("date_start"),
        }

    category_counts = Counter(
        message.get("category")
        for message in race_control_messages
        if message.get("category")
    )

    flag_counts = Counter(
        message.get("flag")
        for message in race_control_messages
        if message.get("flag")
    )

    return {
        "session_key": session_key,
        "session": {
            "meeting_key": session_info.get("meeting_key") if session_info else None,
            "session_name": session_info.get("session_name") if session_info else None,
            "session_type": session_info.get("session_type") if session_info else None,
            "country_name": session_info.get("country_name") if session_info else None,
            "circuit_short_name": session_info.get("circuit_short_name") if session_info else None,
            "location": session_info.get("location") if session_info else None,
            "date_start": session_info.get("date_start") if session_info else None,
            "date_end": session_info.get("date_end") if session_info else None,
            "year": session_info.get("year") if session_info else None,
        },
        "overview": {
            "total_drivers": len(driver_numbers),
            "total_lap_records": len(laps),
            "valid_lap_count": len(valid_laps),
            "max_lap_number": max(lap_numbers) if lap_numbers else 0,
            "race_control_event_count": len(race_control_messages),
        },
        "fastest_lap": fastest_lap,
        "race_control_counts": {
            "by_category": dict(category_counts),
            "by_flag": dict(flag_counts),
        }
    }