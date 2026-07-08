import asyncio
import hashlib
import json
import os
import pathlib
import time
from typing import Any

from redis.asyncio import Redis
from dotenv import load_dotenv

CACHE_DATA_DIR = pathlib.Path(__file__).resolve().parents[2] / "cache_data"
DISK_CACHE_TTL = 30 * 24 * 3600  # 30 days for immutable historical data

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


class DiskCache:
    """Persistent file-based cache. Survives server restarts."""

    def __init__(self):
        self.data_dir = CACHE_DATA_DIR
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.hits = 0
        self.misses = 0

    def _key_to_path(self, key: str) -> pathlib.Path:
        safe = hashlib.sha256(key.encode()).hexdigest()
        return self.data_dir / f"{safe}.json"

    async def _read(self, key: str):
        path = self._key_to_path(key)

        exists = await asyncio.to_thread(path.exists)
        if not exists:
            self.misses += 1
            return None

        try:
            raw = await asyncio.to_thread(lambda: path.read_text(encoding="utf-8"))
            record = json.loads(raw)

            if time.time() > record["expires_at"]:
                await asyncio.to_thread(lambda: path.unlink(missing_ok=True))
                self.misses += 1
                return None

            self.hits += 1
            return record["value"]

        except Exception:
            self.misses += 1
            return None

    async def _write(self, key: str, value: Any, ttl_seconds: int):
        path = self._key_to_path(key)

        try:
            record = {
                "value": value,
                "expires_at": time.time() + ttl_seconds,
            }
            payload = json.dumps(record)
            await asyncio.to_thread(
                lambda: path.write_text(payload, encoding="utf-8")
            )
        except Exception:
            pass

    async def get(self, key: str):
        return await self._read(key)

    async def set(self, key: str, value: Any, ttl_seconds: int = 300):
        await self._write(key, value, ttl_seconds)

    async def clear(self):
        if not self.data_dir.exists():
            return
        children = list(self.data_dir.iterdir())
        for child in children:
            if child.suffix == ".json":
                await asyncio.to_thread(lambda: child.unlink(missing_ok=True))

    def stats(self):
        count = 0
        if self.data_dir.exists():
            count = len(list(self.data_dir.glob("*.json")))
        return {
            "type": "disk",
            "items": count,
            "hits": self.hits,
            "misses": self.misses,
        }


class HybridCache:
    """
    Cache layers checked in order:
      1. Disk (persistent across restarts, 30-day TTL for historical data)
      2. Redis (when REDIS_URL is available)
      3. In-memory (fastest, ephemeral)
    """

    def __init__(self):
        self.disk_cache = DiskCache()
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
        cached = await self.disk_cache.get(key)
        if cached is not None:
            self.memory_cache.set(key, cached, DISK_CACHE_TTL)
            return cached

        if self.redis:
            try:
                cached_value = await self.redis.get(key)

                if cached_value is not None:
                    self.redis_hits += 1
                    parsed = json.loads(cached_value)
                    await self.disk_cache.set(key, parsed, DISK_CACHE_TTL)
                    return parsed

                self.redis_misses += 1

            except Exception:
                self.redis_errors += 1

        return self.memory_cache.get(key)

    async def set(self, key: str, value: Any, ttl_seconds: int = 300):
        await self.disk_cache.set(key, value, max(ttl_seconds, DISK_CACHE_TTL))

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
        await self.disk_cache.clear()

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
            "active_cache": "disk",
            "disk": self.disk_cache.stats(),
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