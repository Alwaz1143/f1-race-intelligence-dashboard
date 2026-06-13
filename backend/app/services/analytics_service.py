from collections import Counter

from app.services.openf1_client import openf1_client
from app.services.driver_service import get_cleaned_drivers
from app.services.lap_service import get_cleaned_laps
from app.services.race_control_service import (
    get_cleaned_race_control_messages,
    get_race_control_counts,
)
from app.utils.time_utils import format_lap_time
from app.utils.stats_utils import calculate_driver_lap_stats
from app.utils.validation_utils import (
    raise_not_found_if_empty,
    validate_different_drivers,
)


def build_driver_map(drivers: list[dict]):
    driver_map = {}

    for driver in drivers:
        driver_number = driver.get("driver_number")

        if driver_number is not None:
            driver_map[driver_number] = {
                "driver_number": driver_number,
                "full_name": driver.get("full_name"),
                "name_acronym": driver.get("name_acronym"),
                "team_name": driver.get("team_name"),
                "team_colour": driver.get("team_colour"),
                "country_code": driver.get("country_code"),
            }

    return driver_map


async def get_session_overview_data(session_key: int):
    sessions = await openf1_client.get("sessions", params={"session_key": session_key})

    raise_not_found_if_empty(
        sessions, f"No session found for session_key={session_key}"
    )

    drivers = await get_cleaned_drivers(session_key)
    laps = await get_cleaned_laps(session_key)
    race_control_messages = await get_cleaned_race_control_messages(session_key)

    session_info = sessions[0]

    driver_numbers = {
        driver.get("driver_number")
        for driver in drivers
        if driver.get("driver_number") is not None
    }

    valid_laps = [lap for lap in laps if lap.get("lap_duration") is not None]

    lap_numbers = [
        lap.get("lap_number") for lap in laps if lap.get("lap_number") is not None
    ]

    fastest_lap = None

    if valid_laps:
        fastest_lap_data = min(valid_laps, key=lambda lap: lap.get("lap_duration"))

        fastest_lap = {
            "driver_number": fastest_lap_data.get("driver_number"),
            "lap_number": fastest_lap_data.get("lap_number"),
            "lap_duration": fastest_lap_data.get("lap_duration"),
            "lap_time_formatted": format_lap_time(fastest_lap_data.get("lap_duration")),
            "date_start": fastest_lap_data.get("date_start"),
        }

    return {
        "session_key": session_key,
        "session": {
            "meeting_key": session_info.get("meeting_key"),
            "session_name": session_info.get("session_name"),
            "session_type": session_info.get("session_type"),
            "country_name": session_info.get("country_name"),
            "circuit_short_name": session_info.get("circuit_short_name"),
            "location": session_info.get("location"),
            "date_start": session_info.get("date_start"),
            "date_end": session_info.get("date_end"),
            "year": session_info.get("year"),
        },
        "overview": {
            "total_drivers": len(driver_numbers),
            "total_lap_records": len(laps),
            "valid_lap_count": len(valid_laps),
            "max_lap_number": max(lap_numbers) if lap_numbers else 0,
            "race_control_event_count": len(race_control_messages),
        },
        "fastest_lap": fastest_lap,
        "race_control_counts": get_race_control_counts(race_control_messages),
    }


async def get_fastest_laps_leaderboard(session_key: int):
    laps = await get_cleaned_laps(session_key)
    drivers = await get_cleaned_drivers(session_key)

    raise_not_found_if_empty(laps, f"No lap data found for session_key={session_key}")

    driver_map = build_driver_map(drivers)

    valid_laps = [lap for lap in laps if lap.get("lap_duration") is not None]

    fastest_by_driver = {}

    for lap in valid_laps:
        driver_number = lap.get("driver_number")
        lap_duration = lap.get("lap_duration")

        if driver_number is None or lap_duration is None:
            continue

        if driver_number not in fastest_by_driver:
            fastest_by_driver[driver_number] = lap
        else:
            current_fastest = fastest_by_driver[driver_number]

            if lap_duration < current_fastest.get("lap_duration"):
                fastest_by_driver[driver_number] = lap

    leaderboard = []

    for driver_number, lap in fastest_by_driver.items():
        driver_info = driver_map.get(driver_number, {})

        leaderboard.append(
            {
                "position": None,
                "driver_number": driver_number,
                "full_name": driver_info.get("full_name"),
                "name_acronym": driver_info.get("name_acronym"),
                "team_name": driver_info.get("team_name"),
                "team_colour": driver_info.get("team_colour"),
                "country_code": driver_info.get("country_code"),
                "lap_number": lap.get("lap_number"),
                "lap_duration": lap.get("lap_duration"),
                "lap_time_formatted": format_lap_time(lap.get("lap_duration")),
                "duration_sector_1": lap.get("duration_sector_1"),
                "duration_sector_2": lap.get("duration_sector_2"),
                "duration_sector_3": lap.get("duration_sector_3"),
                "date_start": lap.get("date_start"),
            }
        )

    leaderboard.sort(key=lambda item: item.get("lap_duration") or 999999)

    for index, item in enumerate(leaderboard, start=1):
        item["position"] = index

    return {
        "session_key": session_key,
        "count": len(leaderboard),
        "leaderboard": leaderboard,
    }


def filter_valid_driver_laps(laps: list[dict], driver_number: int):
    valid_laps = []

    for lap in laps:
        try:
            lap_driver_number = int(lap.get("driver_number"))
        except (TypeError, ValueError):
            continue

        if (
            lap_driver_number == int(driver_number)
            and lap.get("lap_duration") is not None
        ):
            valid_laps.append(lap)

    valid_laps.sort(key=lambda lap: lap.get("lap_number") or 999)

    return valid_laps


async def get_driver_laps_with_fallback(
    session_key: int,
    driver_number: int,
    session_laps: list[dict],
):
    driver_laps = filter_valid_driver_laps(session_laps, driver_number)

    if driver_laps:
        return driver_laps

    fresh_driver_laps = await openf1_client.get(
        "laps",
        params={
            "session_key": session_key,
            "driver_number": driver_number,
        },
        use_cache=False,
        ttl_seconds=60,
        max_retries=2,
        timeout_seconds=12.0,
    )

    return filter_valid_driver_laps(fresh_driver_laps, driver_number)


def build_comparison_data_quality(driver1_laps, driver2_laps):
    is_complete = bool(driver1_laps) and bool(driver2_laps)

    if is_complete:
        message = "Comparison data loaded successfully."
    else:
        message = (
            "One or both drivers have no valid lap data available. "
            "This can happen if the driver retired early, did not set valid laps, "
            "or the external data source returned incomplete lap data."
        )

    return {
        "is_complete": is_complete,
        "driver1_valid_laps": len(driver1_laps),
        "driver2_valid_laps": len(driver2_laps),
        "message": message,
    }


async def compare_driver_lap_data(
    session_key: int,
    driver1: int,
    driver2: int
):
    validate_different_drivers(driver1, driver2)

    laps = await get_cleaned_laps(session_key)
    drivers = await get_cleaned_drivers(session_key)

    raise_not_found_if_empty(
        laps,
        f"No lap data found for session_key={session_key}"
    )

    driver_map = build_driver_map(drivers)

    if driver1 not in driver_map:
        raise_not_found_if_empty(
            [],
            f"Driver {driver1} not found in session_key={session_key}"
        )

    if driver2 not in driver_map:
        raise_not_found_if_empty(
            [],
            f"Driver {driver2} not found in session_key={session_key}"
        )

    driver1_laps = await get_driver_laps_with_fallback(
        session_key=session_key,
        driver_number=driver1,
        session_laps=laps,
    )

    driver2_laps = await get_driver_laps_with_fallback(
        session_key=session_key,
        driver_number=driver2,
        session_laps=laps,
    )

    driver1_stats = calculate_driver_lap_stats(driver1_laps)
    driver2_stats = calculate_driver_lap_stats(driver2_laps)

    driver1_lap_map = {
        lap.get("lap_number"): lap
        for lap in driver1_laps
        if lap.get("lap_number") is not None
    }

    driver2_lap_map = {
        lap.get("lap_number"): lap
        for lap in driver2_laps
        if lap.get("lap_number") is not None
    }

    common_lap_numbers = sorted(
        set(driver1_lap_map.keys()) & set(driver2_lap_map.keys())
    )

    lap_by_lap_comparison = []

    for lap_number in common_lap_numbers:
        d1_lap = driver1_lap_map[lap_number]
        d2_lap = driver2_lap_map[lap_number]

        d1_time = d1_lap.get("lap_duration")
        d2_time = d2_lap.get("lap_duration")

        difference = round(d1_time - d2_time, 3)

        lap_by_lap_comparison.append({
            "lap_number": lap_number,
            "driver1_lap_duration": d1_time,
            "driver1_lap_time_formatted": format_lap_time(d1_time),
            "driver2_lap_duration": d2_time,
            "driver2_lap_time_formatted": format_lap_time(d2_time),
            "difference": difference,
            "faster_driver": driver1
            if difference < 0
            else driver2
            if difference > 0
            else "equal"
        })

    fastest_lap_difference = None
    average_lap_difference = None
    median_lap_difference = None

    if driver1_stats["fastest_lap"] and driver2_stats["fastest_lap"]:
        fastest_lap_difference = round(
            driver1_stats["fastest_lap"]["lap_duration"]
            - driver2_stats["fastest_lap"]["lap_duration"],
            3
        )

    if (
        driver1_stats["average_lap"] is not None
        and driver2_stats["average_lap"] is not None
    ):
        average_lap_difference = round(
            driver1_stats["average_lap"] - driver2_stats["average_lap"],
            3
        )

    if (
        driver1_stats["median_lap"] is not None
        and driver2_stats["median_lap"] is not None
    ):
        median_lap_difference = round(
            driver1_stats["median_lap"] - driver2_stats["median_lap"],
            3
        )

    return {
        "session_key": session_key,
        "drivers": {
            "driver1": driver_map.get(driver1, {"driver_number": driver1}),
            "driver2": driver_map.get(driver2, {"driver_number": driver2}),
        },
        "stats": {
            "driver1": driver1_stats,
            "driver2": driver2_stats,
        },
        "differences": {
            "fastest_lap_difference": fastest_lap_difference,
            "average_lap_difference": average_lap_difference,
            "median_lap_difference": median_lap_difference,
            "note": (
                "Negative value means driver1 was faster. "
                "Positive value means driver2 was faster."
            )
        },
        "data_quality": build_comparison_data_quality(
            driver1_laps,
            driver2_laps,
        ),
        "lap_by_lap_comparison": lap_by_lap_comparison
    }
