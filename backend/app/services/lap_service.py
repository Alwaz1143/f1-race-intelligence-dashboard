from app.services.openf1_client import openf1_client
from app.utils.time_utils import format_lap_time


async def get_cleaned_laps(
    session_key: int,
    driver_number: int | None = None
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

    return cleaned_laps