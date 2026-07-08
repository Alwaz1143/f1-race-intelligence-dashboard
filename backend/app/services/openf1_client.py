import asyncio

import httpx
from fastapi import HTTPException

from app.core.config import settings
from app.core.cache import cache


class OpenF1Client:
    def __init__(self):
        self.base_url = settings.OPENF1_BASE_URL
        self._client: httpx.AsyncClient | None = None
        self._inflight: dict[str, asyncio.Future] = {}

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=httpx.Timeout(10.0))
        return self._client

    def build_cache_key(self, endpoint: str, params: dict | None = None):
        if not params:
            return f"openf1:{endpoint}"

        sorted_params = sorted(params.items())
        params_string = "&".join(f"{key}={value}" for key, value in sorted_params)

        return f"openf1:{endpoint}:{params_string}"

    def should_retry_status(self, status_code: int) -> bool:
        return status_code in {408, 429, 500, 502, 503, 504}

    def should_cache_response(self, endpoint: str, data):
        if endpoint == "laps" and data == []:
            return False

        return True

    async def _fetch_with_retry(
        self,
        url: str,
        params: dict | None,
        max_retries: int,
        timeout_seconds: float,
    ):
        last_error = None
        client = await self._get_client()

        for attempt in range(max_retries):
            try:
                response = await client.get(url, params=params, timeout=timeout_seconds)
                response.raise_for_status()
                return response.json()

            except httpx.HTTPStatusError as e:
                last_error = e
                status_code = e.response.status_code

                if status_code == 404:
                    return []

                if self.should_retry_status(status_code) and attempt < max_retries - 1:
                    await asyncio.sleep(0.75 * (attempt + 1))
                    continue

                raise HTTPException(
                    status_code=status_code,
                    detail=f"OpenF1 API error: {e.response.text}",
                ) from e

            except httpx.RequestError as e:
                last_error = e

                if attempt < max_retries - 1:
                    await asyncio.sleep(0.75 * (attempt + 1))
                    continue

                raise HTTPException(
                    status_code=503,
                    detail="Could not connect to OpenF1 API",
                ) from e

        raise HTTPException(
            status_code=503,
            detail=f"OpenF1 API request failed after retries: {str(last_error)}",
        )

    async def get(
        self,
        endpoint: str,
        params: dict | None = None,
        use_cache: bool = True,
        ttl_seconds: int = 3600,
        max_retries: int = 1,
        timeout_seconds: float = 10.0,
    ):
        url = f"{self.base_url}/{endpoint}"
        cache_key = self.build_cache_key(endpoint, params)

        if use_cache:
            cached_data = await cache.get(cache_key)

            if cached_data is not None:
                return cached_data

        inflight = self._inflight.get(cache_key)
        if inflight is not None:
            return await inflight

        loop = asyncio.get_event_loop()
        future = loop.create_future()
        self._inflight[cache_key] = future

        try:
            data = await self._fetch_with_retry(url, params, max_retries, timeout_seconds)

            if use_cache and self.should_cache_response(endpoint, data):
                await cache.set(cache_key, data, ttl_seconds)

            future.set_result(data)
            return data

        except Exception as e:
            future.set_exception(e)
            raise

        finally:
            self._inflight.pop(cache_key, None)


openf1_client = OpenF1Client()
