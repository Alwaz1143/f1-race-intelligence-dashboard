from fastapi import APIRouter

from app.core.cache import cache

router = APIRouter()


@router.get("/cache/stats")
def get_cache_stats():
    return cache.stats()


@router.delete("/cache/clear")
def clear_cache():
    cache.clear()

    return {
        "message": "Cache cleared successfully"
    }