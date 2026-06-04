import httpx
from fastapi import HTTPException

from app.core.config import settings
from app.core.cache import cache


class OpenF1Client:
    def __init__(self):
        self.base_url = settings.OPENF1_BASE_URL

    def build_cache_key(self, endpoint: str, params: dict | None = None):
        if not params:
            return f"openf1:{endpoint}"

        sorted_params = sorted(params.items())
        params_string = "&".join(
            f"{key}={value}" for key, value in sorted_params
        )

        return f"openf1:{endpoint}:{params_string}"

    async def get(
        self,
        endpoint: str,
        params: dict | None = None,
        use_cache: bool = True,
        ttl_seconds: int = 300
    ):
        url = f"{self.base_url}/{endpoint}"
        cache_key = self.build_cache_key(endpoint, params)

        if use_cache:
            cached_data = cache.get(cache_key)

            if cached_data is not None:
                return cached_data

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

                if use_cache:
                    cache.set(cache_key, data, ttl_seconds)

                return data

        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"OpenF1 API error: {e.response.text}"
            )

        except httpx.RequestError:
            raise HTTPException(
                status_code=503,
                detail="Could not connect to OpenF1 API"
            )


openf1_client = OpenF1Client()