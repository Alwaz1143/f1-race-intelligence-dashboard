import asyncio
import json
import logging
import time

from fastapi import HTTPException
from google import genai
from openai import AsyncOpenAI

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

logger = logging.getLogger(__name__)


def build_ai_summary_prompt(payload: dict) -> str:
    return f""" You are an expert Formula 1 race analyst writing for an analytics dashboard. Generate a polished, concise session intelligence summary using only the provided data. STRICT RULES: - Return Markdown only. - Do not wrap the answer in a code block. - Do not invent facts, causes, strategies, weather, incidents, or driver context that are not present in the data. - If a value is missing, write "Not available" only when needed. - Keep the full response between 160 and 240 words. - Use the exact heading structure shown below. - Use short paragraphs and bullet points. - Prefer formatted lap-time fields when available. - Do not include raw JSON or mention that data was provided. REQUIRED FORMAT: ## Session Brief Write 2-3 sentences describing the session, including location, session type, year, driver count, lap volume, and race-control activity if available. ## Key Metrics - **Session:** session name and type - **Location:** circuit/location/country - **Drivers:** total drivers - **Valid Laps:** valid lap count - **Race Control Events:** total race-control event count ## Pace Highlights - **Fastest Lap:** driver, team, lap time, and lap number - **Top Pace Group:** briefly compare the top 3-5 fastest drivers - **Sector Insight:** mention sector information only if available ## Race Control Notes - Summarize the most important race-control categories, flags, or alerts. - Mention safety cars, red flags, yellow flags, DRS, rain, low grip, or aborted starts only if present in the provided data. ## Key Takeaway Write one strong concluding sentence explaining the main performance or session story. Data: {json.dumps(payload, indent=2)} """


STALE_AFTER_SECONDS = 1800
CACHE_TTL_SECONDS = 3600


async def _call_groq(prompt: str) -> tuple[str, str]:
    """Call Groq LPU (fast, free inference)."""
    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Groq API key is not configured.",
        )

    client = AsyncOpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )

    for attempt in range(3):
        try:
            response = await client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
            )
            text = response.choices[0].message.content or "AI summary could not be generated."
            return text, f"groq/{settings.GROQ_MODEL}"
        except Exception as e:
            error_str = str(e).lower()
            is_retryable = any(
                signal in error_str
                for signal in [
                    "503", "429", "unavailable", "rate limit", "timeout",
                ]
            )
            if is_retryable and attempt < 2:
                await asyncio.sleep(1.5 * (attempt + 1))
                continue
            logger.warning("Groq attempt %d failed: %s", attempt + 1, e)
            break

    raise HTTPException(
        status_code=503,
        detail="Groq API unavailable.",
    )


async def _call_gemini_with_fallback(prompt: str) -> tuple[str, str]:
    """Try primary model, then fallback models on failure."""
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is not configured.",
        )

    models = [settings.GEMINI_MODEL, *settings.GEMINI_FALLBACK_MODELS]
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    for model_name in models:
        for attempt in range(3):
            try:
                response = await client.aio.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )
                text = response.text or "AI summary could not be generated."
                return text, model_name
            except Exception as e:
                error_str = str(e).lower()
                is_retryable = any(
                    signal in error_str
                    for signal in [
                        "503", "429", "unavailable", "high demand",
                        "resource exhausted", "rate limit", "timeout",
                    ]
                )
                if is_retryable and attempt < 2:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                break

    raise HTTPException(
        status_code=503,
        detail="AI summary generation failed — all Gemini models unavailable.",
    )


async def _call_ai_with_fallback(prompt: str) -> tuple[str, str]:
    """Try Groq first (fast, free), fall back to Gemini."""
    if settings.GROQ_API_KEY:
        try:
            return await _call_groq(prompt)
        except HTTPException as e:
            logger.warning("Groq failed, falling back to Gemini: %s", e.detail)

    return await _call_gemini_with_fallback(prompt)


def _strip_none(record: dict) -> dict:
    return {k: v for k, v in record.items() if v is not None}


def _compact_lap(lap: dict) -> dict:
    return _strip_none({
        "n": lap.get("driver_number"),
        "p": lap.get("position"),
        "lt": lap.get("lap_time_formatted"),
        "ln": lap.get("lap_number"),
        "s1": lap.get("duration_sector_1"),
        "s2": lap.get("duration_sector_2"),
        "s3": lap.get("duration_sector_3"),
        "drv": lap.get("full_name") or lap.get("name_acronym"),
        "tm": lap.get("team_name"),
        "tc": lap.get("team_colour"),
    })


def _compact_rc(msg: dict) -> dict:
    return _strip_none({
        "cat": msg.get("category"),
        "flag": msg.get("flag"),
        "msg": msg.get("message"),
        "lap": msg.get("lap_number"),
        "drv": msg.get("driver_number"),
    })


async def _build_compact_payload(session_key: int) -> dict:
    overview_task = get_session_overview_data(session_key)
    fastest_laps_task = get_fastest_laps_leaderboard(session_key)
    rc_task = get_cleaned_race_control_messages(session_key)

    overview_data, fastest_laps_data, race_control_messages = await asyncio.gather(
        overview_task, fastest_laps_task, rc_task
    )

    overview = overview_data.get("overview", {})
    session_info = overview_data.get("session", {})
    fastest_lap_raw = overview_data.get("fastest_lap")
    leaderboard = fastest_laps_data.get("leaderboard", [])
    race_control_counts = get_race_control_counts(race_control_messages)

    return {
        "s": _strip_none({
            "name": session_info.get("session_name"),
            "type": session_info.get("session_type"),
            "loc": f'{session_info.get("location")}, {session_info.get("country_name")}',
            "circuit": session_info.get("circuit_short_name"),
            "yr": session_info.get("year"),
        }),
        "o": _strip_none({
            "drv": overview.get("total_drivers"),
            "laps": overview.get("valid_lap_count"),
            "rc": overview.get("race_control_event_count"),
        }),
        "fl": _compact_lap(fastest_lap_raw) if fastest_lap_raw else None,
        "top": [_compact_lap(l) for l in leaderboard[:5]],
        "rc_counts": {
            "cat": race_control_counts.get("by_category", {}),
            "flag": race_control_counts.get("by_flag", {}),
        },
        "rc_msgs": [_compact_rc(m) for m in race_control_messages[:5]],
    }


async def generate_ai_session_summary(session_key: int):
    cache_key = f"ai_summary:v4:session:{session_key}"

    if not settings.GEMINI_API_KEY and not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="No AI provider API key configured. Set GROQ_API_KEY or GEMINI_API_KEY.",
        )

    cached_summary = await cache.get(cache_key)

    if cached_summary is not None:
        cached_summary = dict(cached_summary)
        cached_summary["cached"] = True
        is_stale = (time.time() - cached_summary.get("cached_at", 0)) > STALE_AFTER_SECONDS

        if not is_stale:
            return cached_summary

        asyncio.create_task(_background_refresh(session_key, cache_key))
        return cached_summary

    compact_payload = await _build_compact_payload(session_key)
    prompt = build_ai_summary_prompt(compact_payload)

    try:
        summary_text, model_used = await _call_ai_with_fallback(prompt)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI summary generation failed: {str(e)}",
        )

    result = {
        "session_key": session_key,
        "model": model_used,
        "summary": summary_text,
        "cached": False,
        "cached_at": time.time(),
    }

    await cache.set(cache_key, result, ttl_seconds=CACHE_TTL_SECONDS)

    return result


async def _background_refresh(session_key: int, cache_key: str):
    try:
        compact_payload = await _build_compact_payload(session_key)
        prompt = build_ai_summary_prompt(compact_payload)
        summary_text, model_used = await _call_ai_with_fallback(prompt)

        result = {
            "session_key": session_key,
            "model": model_used,
            "summary": summary_text,
            "cached": False,
            "cached_at": time.time(),
        }

        await cache.set(cache_key, result, ttl_seconds=CACHE_TTL_SECONDS)
    except Exception:
        pass
