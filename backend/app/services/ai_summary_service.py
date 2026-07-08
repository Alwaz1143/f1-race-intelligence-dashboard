import asyncio
import json

from fastapi import HTTPException
from google import genai

from app.core.cache import cache
from app.core.config import settings
from app.services.analytics_service import (
    get_fastest_laps_leaderboard,
    get_session_overview_data,
)
from app.services.race_control_service import (
    get_cleaned_race_control_messages,
    get_race_control_counts,
)


def build_ai_summary_prompt(payload: dict) -> str:
    return f""" You are an expert Formula 1 race analyst writing for an analytics dashboard. Generate a polished, concise session intelligence summary using only the provided data. STRICT RULES: - Return Markdown only. - Do not wrap the answer in a code block. - Do not invent facts, causes, strategies, weather, incidents, or driver context that are not present in the data. - If a value is missing, write "Not available" only when needed. - Keep the full response between 160 and 240 words. - Use the exact heading structure shown below. - Use short paragraphs and bullet points. - Prefer formatted lap-time fields when available. - Do not include raw JSON or mention that data was provided. REQUIRED FORMAT: ## Session Brief Write 2-3 sentences describing the session, including location, session type, year, driver count, lap volume, and race-control activity if available. ## Key Metrics - **Session:** session name and type - **Location:** circuit/location/country - **Drivers:** total drivers - **Valid Laps:** valid lap count - **Race Control Events:** total race-control event count ## Pace Highlights - **Fastest Lap:** driver, team, lap time, and lap number - **Top Pace Group:** briefly compare the top 3-5 fastest drivers - **Sector Insight:** mention sector information only if available ## Race Control Notes - Summarize the most important race-control categories, flags, or alerts. - Mention safety cars, red flags, yellow flags, DRS, rain, low grip, or aborted starts only if present in the provided data. ## Key Takeaway Write one strong concluding sentence explaining the main performance or session story. Data: {json.dumps(payload, indent=2)} """


async def generate_ai_session_summary(session_key: int):
    cache_key = f"ai_summary:v2:session:{session_key}"

    cached_summary = await cache.get(cache_key)

    if cached_summary is not None:
        cached_summary = dict(cached_summary)
        cached_summary["cached"] = True
        return cached_summary

    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is not configured.",
        )

    overview_task = get_session_overview_data(session_key)
    fastest_laps_task = get_fastest_laps_leaderboard(session_key)
    rc_task = get_cleaned_race_control_messages(session_key)

    overview_data, fastest_laps_data, race_control_messages = await asyncio.gather(
        overview_task, fastest_laps_task, rc_task
    )
    race_control_counts = get_race_control_counts(race_control_messages)

    compact_payload = {
        "session": overview_data.get("session"),
        "overview": overview_data.get("overview"),
        "fastest_lap": overview_data.get("fastest_lap"),
        "top_fastest_laps": fastest_laps_data.get("leaderboard", [])[:5],
        "race_control_counts": race_control_counts,
        "sample_race_control_messages": race_control_messages[:10],
    }

    prompt = build_ai_summary_prompt(compact_payload)

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
        )

        summary_text = response.text or "AI summary could not be generated."

        result = {
            "session_key": session_key,
            "model": settings.GEMINI_MODEL,
            "summary": summary_text,
            "cached": False,
        }

        await cache.set(cache_key, result, ttl_seconds=3600)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI summary generation failed: {str(e)}",
        )
