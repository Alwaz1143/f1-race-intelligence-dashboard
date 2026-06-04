import time
from typing import Any


class InMemoryCache:
    def __init__(self):
        self.store = {}
        self.hits = 0
        self.misses = 0

    def get(self, key: str):
        item = self.store.get(key)

        if item is None:
            self.misses += 1
            return None

        expires_at = item["expires_at"]

        if time.time() > expires_at:
            del self.store[key]
            self.misses += 1
            return None

        self.hits += 1
        return item["value"]

    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        self.store[key] = {
            "value": value,
            "expires_at": time.time() + ttl_seconds
        }

    def clear(self):
        self.store.clear()
        self.hits = 0
        self.misses = 0

    def stats(self):
        return {
            "cache_type": "in-memory",
            "keys": len(self.store),
            "hits": self.hits,
            "misses": self.misses
        }


cache = InMemoryCache()