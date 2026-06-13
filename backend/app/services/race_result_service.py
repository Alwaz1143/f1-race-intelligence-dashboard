from typing import Any

from fastapi import HTTPException

from app.services.jolpica_client import jolpica_client


def build_driver_name(driver: dict[str, Any]) -> str:
    given_name = driver.get("givenName", "")
    family_name = driver.get("familyName", "")

    full_name = f"{given_name} {family_name}".strip()

    return full_name or driver.get("driverId", "Unknown Driver")


def normalize_result(result: dict[str, Any]) -> dict[str, Any]:
    driver = result.get("Driver", {})
    constructor = result.get("Constructor", {})
    time_data = result.get("Time", {})

    position_text = result.get("positionText") or result.get("position") or "N/A"

    time_or_status = (
        time_data.get("time")
        or result.get("status")
        or "N/A"
    )

    return {
        "position": position_text,
        "position_number": result.get("position"),
        "driver_number": result.get("number") or driver.get("permanentNumber"),
        "driver_code": driver.get("code"),
        "driver_name": build_driver_name(driver),
        "team_name": constructor.get("name", "Unknown Team"),
        "laps": result.get("laps"),
        "time_or_status": time_or_status,
        "status": result.get("status"),
        "points": result.get("points", "0"),
        "grid": result.get("grid"),
    }


async def get_race_classification(year: int, round_number: int) -> dict[str, Any]:
    raw_data = await jolpica_client.get_race_results(year, round_number)

    race_table = raw_data.get("MRData", {}).get("RaceTable", {})
    races = race_table.get("Races", [])

    if not races:
        raise HTTPException(
            status_code=404,
            detail="Race classification is not available for the selected race yet.",
        )

    race = races[0]
    circuit = race.get("Circuit", {})
    location = circuit.get("Location", {})

    results = race.get("Results", [])

    normalized_results = [
        normalize_result(result)
        for result in results
    ]

    return {
        "source": "Jolpica-F1",
        "year": int(race.get("season", year)),
        "round": int(race.get("round", round_number)),
        "race_name": race.get("raceName"),
        "circuit_name": circuit.get("circuitName"),
        "location": location.get("locality"),
        "country": location.get("country"),
        "date": race.get("date"),
        "time": race.get("time"),
        "classification_count": len(normalized_results),
        "results": normalized_results,
    }