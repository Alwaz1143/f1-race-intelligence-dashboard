import json
import os
import time
from typing import Any

from redis.asyncio import Redis
from dotenv import load_dotenv

# BACKEND_ROOT = Path(__file__).resolve().parents[2]
# load_dotenv(BACKEND_ROOT / ".env")

class InMemoryCache:
    def __init__(self):
        self.store: dict[str, dict[str, Any]] = {}
        self.hits = 0
        self.misses = 0

    def get(self, key: str):
        item = self.store.get(key)

        if item is None:
            self.misses += 1
            return None

        if time.time() > item["expires_at"]:
            self.store.pop(key, None)
            self.misses += 1
            return None

        self.hits += 1
        return item["value"]

    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        self.store[key] = {
            "value": value,
            "expires_at": time.time() + ttl_seconds,
        }

    def clear(self):
        self.store.clear()
        self.hits = 0
        self.misses = 0

    def stats(self):
        return {
            "type": "in-memory",
            "items": len(self.store),
            "hits": self.hits,
            "misses": self.misses,
        }


class HybridCache:
    """
    Uses Redis when REDIS_URL is available.
    Falls back to in-memory cache when Redis is not configured or fails.
    """

    def __init__(self):
        self.memory_cache = InMemoryCache()
        self.redis_url = os.getenv("REDIS_URL")
        self.redis: Redis | None = None
        self.redis_hits = 0
        self.redis_misses = 0
        self.redis_errors = 0

        if self.redis_url:
            self.redis = Redis.from_url(
                self.redis_url,
                decode_responses=True,
            )

    async def get(self, key: str):
        if self.redis:
            try:
                cached_value = await self.redis.get(key)

                if cached_value is not None:
                    self.redis_hits += 1
                    return json.loads(cached_value)

                self.redis_misses += 1

            except Exception:
                self.redis_errors += 1

        return self.memory_cache.get(key)

    async def set(self, key: str, value: Any, ttl_seconds: int = 300):
        if self.redis:
            try:
                await self.redis.set(
                    key,
                    json.dumps(value),
                    ex=ttl_seconds,
                )
                return
            except Exception:
                self.redis_errors += 1

        self.memory_cache.set(key, value, ttl_seconds)

    async def clear(self):
        if self.redis:
            try:
                await self.redis.flushdb()
            except Exception:
                self.redis_errors += 1

        self.memory_cache.clear()

    async def stats(self):
        redis_connected = False
        redis_items = None

        if self.redis:
            try:
                await self.redis.ping()
                redis_connected = True
                redis_items = await self.redis.dbsize()
            except Exception:
                self.redis_errors += 1

        return {
            "active_cache": "redis" if redis_connected else "in-memory",
            "redis": {
                "configured": bool(self.redis_url),
                "connected": redis_connected,
                "items": redis_items,
                "hits": self.redis_hits,
                "misses": self.redis_misses,
                "errors": self.redis_errors,
            },
            "memory": self.memory_cache.stats(),
        }


cache = HybridCache()