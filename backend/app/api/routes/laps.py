from fastapi import APIRouter, Query

from app.services.openf1_client import openf1_client

router = APIRouter()


def format_lap_time(seconds: float | None):
    if seconds is None:
        return None

    minutes = int(seconds // 60)
    remaining_seconds = seconds - (minutes * 60)

    return f"{minutes}:{remaining_seconds:06.3f}"


@router.get("/laps")
async def get_laps(
    session_key: int = Query(..., description="OpenF1 session key"),
    driver_number: int | None = Query(
        default=None,
        description="Optional driver number. If not provided, returns laps for all drivers."
    )
):
    params = {
        "session_key": session_key
    }

    if driver_number is not None:
        params["driver_number"] = driver_number

    laps = await openf1_client.get(
        "laps",
        params=params
    )

    cleaned_laps = []

    for lap in laps:
        lap_duration = lap.get("lap_duration")

        cleaned_laps.append({
            "meeting_key": lap.get("meeting_key"),
            "session_key": lap.get("session_key"),
            "driver_number": lap.get("driver_number"),
            "lap_number": lap.get("lap_number"),
            "date_start": lap.get("date_start"),

            "lap_duration": lap_duration,
            "lap_time_formatted": format_lap_time(lap_duration),

            "duration_sector_1": lap.get("duration_sector_1"),
            "duration_sector_2": lap.get("duration_sector_2"),
            "duration_sector_3": lap.get("duration_sector_3"),

            "i1_speed": lap.get("i1_speed"),
            "i2_speed": lap.get("i2_speed"),
            "st_speed": lap.get("st_speed"),

            "is_pit_out_lap": lap.get("is_pit_out_lap"),
            "is_valid_lap": lap_duration is not None
        })

    cleaned_laps.sort(
        key=lambda item: (
            item.get("driver_number") or 999,
            item.get("lap_number") or 999
        )
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