from collections import Counter

from app.services.openf1_client import openf1_client


async def get_cleaned_race_control_messages(session_key: int):
    messages = await openf1_client.get(
        "race_control",
        params={"session_key": session_key}
    )

    cleaned_messages = []

    for item in messages:
        cleaned_messages.append({
            "meeting_key": item.get("meeting_key"),
            "session_key": item.get("session_key"),
            "date": item.get("date"),
            "lap_number": item.get("lap_number"),
            "driver_number": item.get("driver_number"),
            "category": item.get("category"),
            "flag": item.get("flag"),
            "scope": item.get("scope"),
            "sector": item.get("sector"),
            "message": item.get("message"),
        })

    cleaned_messages.sort(
        key=lambda item: item.get("date") or ""
    )

    return cleaned_messages


def get_race_control_counts(messages: list[dict]):
    category_counts = Counter(
        item.get("category")
        for item in messages
        if item.get("category")
    )

    flag_counts = Counter(
        item.get("flag")
        for item in messages
        if item.get("flag")
    )

    return {
        "by_category": dict(category_counts),
        "by_flag": dict(flag_counts),
    }