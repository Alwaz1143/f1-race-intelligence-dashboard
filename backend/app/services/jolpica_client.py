from typing import Any

import httpx
from fastapi import HTTPException

from app.core.cache import cache
from app.core.config import settings


class JolpicaClient:
    def __init__(self):
        self.base_url = settings.JOLPICA_BASE_URL.rstrip("/")

    async def _fetch(self, url: str) -> dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.get(url)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=f"Jolpica API error: {exc.response.text}",
            ) from exc
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Failed to connect to Jolpica API: {str(exc)}",
            ) from exc

    async def get_race_results(self, year: int, round_number: int) -> dict[str, Any]:
        cache_key = f"jolpica:race_results:{year}:{round_number}"
        cached_data = await cache.get(cache_key)
        if cached_data is not None:
            return cached_data

        url = f"{self.base_url}/{year}/{round_number}/results.json"
        data = await self._fetch(url)
        await cache.set(cache_key, data, ttl_seconds=6 * 60 * 60)
        return data

    async def get_race_list(self, year: int) -> dict[str, Any]:
        cache_key = f"jolpica:race_list:{year}"
        cached_data = await cache.get(cache_key)
        if cached_data is not None:
            return cached_data

        url = f"{self.base_url}/{year}.json"
        data = await self._fetch(url)
        await cache.set(cache_key, data, ttl_seconds=6 * 60 * 60)
        return data

    async def get_race_laps(self, year: int, round_number: int) -> dict[str, Any]:
        cache_key = f"jolpica:laps:{year}:{round_number}"
        cached_data = await cache.get(cache_key)
        if cached_data is not None:
            return cached_data

        url = f"{self.base_url}/{year}/{round_number}/laps.json"
        data = await self._fetch(url)
        await cache.set(cache_key, data, ttl_seconds=6 * 60 * 60)
        return data


jolpica_client = JolpicaClient()