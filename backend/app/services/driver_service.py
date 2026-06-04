from app.services.openf1_client import openf1_client


async def get_cleaned_drivers(session_key: int):
    drivers = await openf1_client.get(
        "drivers",
        params={"session_key": session_key}
    )

    cleaned_drivers = []

    for driver in drivers:
        cleaned_drivers.append({
            "session_key": driver.get("session_key"),
            "driver_number": driver.get("driver_number"),
            "broadcast_name": driver.get("broadcast_name"),
            "full_name": driver.get("full_name"),
            "name_acronym": driver.get("name_acronym"),
            "first_name": driver.get("first_name"),
            "last_name": driver.get("last_name"),
            "team_name": driver.get("team_name"),
            "team_colour": driver.get("team_colour"),
            "country_code": driver.get("country_code"),
            "headshot_url": driver.get("headshot_url"),
        })

    cleaned_drivers.sort(
        key=lambda item: item.get("driver_number") or 999
    )

    return cleaned_drivers