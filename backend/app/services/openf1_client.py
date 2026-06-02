import httpx
from fastapi import HTTPException
from app.core.config import settings

class OpenF1Client:
    def __init__(self):
        self.base_url = settings.OPENF1_BASE_URL

    async def get(self, endpoint: str, params: dict | None = None):
        url = f"{self.base_url}/{endpoint}"
        try:
            async with httpx.AsyncClient(timeout = 10.0) as client:
                response = await client.get(url, params = params)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code = e.response.status_code,
                detail = f"OpenF1 API error: {e.response.text}"
            )
        except httpx.RequestError :
            raise HTTPException(
                status_code = 503,
                detail = "Could not connect to OpenF1 API"
            )
openf1_client = OpenF1Client()