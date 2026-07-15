from typing import Any

from app.services.jolpica_client import jolpica_client
from app.services.race_result_service import normalize_result
from app.utils.time_utils import format_lap_time


def _parse_lap_time(time_str: str) -> float | None:
    if not time_str:
        return None
    try:
        parts = time_str.split(":")
        if len(parts) == 2:
            return int(parts[0]) * 60 + float(parts[1])
        if len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
        return float(parts[0])
    except (ValueError, IndexError):
        return None


def _build_driver_map(results: list[dict]) -> dict[str, dict]:
    mapping = {}
    for result in results:
        driver = result.get("Driver", {})
        driver_id = driver.get("driverId")
        constructor = result.get("Constructor", {})
        number = result.get("number") or driver.get("permanentNumber")
        if driver_id:
            mapping[driver_id] = {
                "driver_number": int(number) if number else None,
                "full_name": f"{driver.get('givenName', '')} {driver.get('familyName', '')}".strip(),
                "name_acronym": driver.get("code"),
                "team_name": constructor.get("name"),
                "team_colour": None,
            }
    return mapping


def _normalize_laps(laps_data: dict, driver_map: dict) -> list[dict]:
    laps = []
    races = laps_data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
    if not races:
        return laps

    for lap_group in races[0].get("Laps", []):
        lap_number = int(lap_group.get("number", 0))
        for timing in lap_group.get("Timings", []):
            driver_id = timing.get("driverId")
            info = driver_map.get(driver_id, {})
            time_str = timing.get("time", "")
            duration = _parse_lap_time(time_str)
            laps.append({
                "driver_number": info.get("driver_number"),
                "full_name": info.get("full_name"),
                "name_acronym": info.get("name_acronym"),
                "team_name": info.get("team_name"),
                "team_colour": info.get("team_colour"),
                "lap_number": lap_number,
                "lap_duration": duration,
                "lap_time_formatted": format_lap_time(duration),
                "position": int(timing.get("position", 0)),
            })
    return laps


def _get_fastest_lap_per_driver(laps: list[dict]) -> dict[int, dict]:
    fastest = {}
    for lap in laps:
        dn = lap["driver_number"]
        dur = lap["lap_duration"]
        if dn is None or dur is None:
            continue
        if dn not in fastest or dur < fastest[dn]["lap_duration"]:
            fastest[dn] = {
                "driver_number": dn,
                "full_name": lap["full_name"],
                "name_acronym": lap["name_acronym"],
                "team_name": lap["team_name"],
                "team_colour": lap["team_colour"],
                "lap_number": lap["lap_number"],
                "lap_duration": dur,
                "lap_time_formatted": lap["lap_time_formatted"],
            }
    return fastest


async def get_jolpica_bulk_analytics(year: int, round_number: int) -> dict[str, Any]:
    import asyncio

    results_data, laps_data = await asyncio.gather(
        jolpica_client.get_race_results(year, round_number),
        jolpica_client.get_race_laps(year, round_number),
    )

    race_table = results_data.get("MRData", {}).get("RaceTable", {})
    races = race_table.get("Races", [])
    race = races[0] if races else {}
    circuit = race.get("Circuit", {})
    location = circuit.get("Location", {})
    results = race.get("Results", [])

    driver_map = _build_driver_map(results)
    laps = _normalize_laps(laps_data, driver_map)

    drivers = []
    for dn_info in driver_map.values():
        drivers.append({
            "driver_number": dn_info["driver_number"],
            "full_name": dn_info["full_name"],
            "name_acronym": dn_info["name_acronym"],
            "team_name": dn_info["team_name"],
            "team_colour": dn_info["team_colour"],
        })

    fastest_per_driver = _get_fastest_lap_per_driver(laps)
    sorted_fastest = sorted(
        fastest_per_driver.values(),
        key=lambda x: x["lap_duration"],
    )
    leaderboard = []
    for idx, fl in enumerate(sorted_fastest, 1):
        leaderboard.append({
            "position": idx,
            **fl,
            "duration_sector_1": None,
            "duration_sector_2": None,
            "duration_sector_3": None,
        })

    overall_fastest = sorted_fastest[0] if sorted_fastest else None

    unique_lap_numbers = set(l["lap_number"] for l in laps if l["lap_number"])
    total_laps = len(unique_lap_numbers)

    results_normalized = []
    for r in results:
        results_normalized.append(normalize_result(r))

    return {
        "overview": {
            "total_drivers": len(drivers),
            "valid_lap_count": total_laps,
            "race_control_event_count": 0,
            "total_laps": total_laps,
            "session": {
                "session_name": "Race",
                "session_type": "Race",
                "circuit_short_name": circuit.get("circuitName"),
                "location": location.get("locality"),
                "country_name": location.get("country"),
                "year": int(race.get("season", year)),
                "date": race.get("date"),
            },
            "fastest_lap": {
                "driver_number": overall_fastest["driver_number"] if overall_fastest else None,
                "full_name": overall_fastest["full_name"] if overall_fastest else None,
                "name_acronym": overall_fastest["name_acronym"] if overall_fastest else None,
                "team_name": overall_fastest["team_name"] if overall_fastest else None,
                "lap_duration": overall_fastest["lap_duration"] if overall_fastest else None,
                "lap_time_formatted": overall_fastest["lap_time_formatted"] if overall_fastest else None,
                "lap_number": overall_fastest["lap_number"] if overall_fastest else None,
            } if overall_fastest else None,
        },
        "fastest_laps": {
            "leaderboard": leaderboard,
        },
        "drivers": {
            "drivers": drivers,
        },
        "race_control": {
            "messages": [],
            "event_counts": {"by_category": {}, "by_flag": {}},
        },
        "_all_laps": laps,
        "race_classification": {
            "year": int(race.get("season", year)),
            "round": int(race.get("round", round_number)),
            "race_name": race.get("raceName"),
            "circuit_name": circuit.get("circuitName"),
            "location": location.get("locality"),
            "country": location.get("country"),
            "date": race.get("date"),
            "results": results_normalized,
        },
    }
