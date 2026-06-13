from fastapi import APIRouter

from app.core.cache import cache

router = APIRouter()


@router.get("/cache/stats")
async def get_cache_stats():
    return await cache.stats()


@router.delete("/cache/clear")
async def clear_cache():
    await cache.clear()

    return {
        "message": "Cache cleared successfully"
    }