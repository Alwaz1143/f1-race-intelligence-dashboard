from app.core.cache import InMemoryCache


def test_cache_set_and_get():
    cache = InMemoryCache()

    cache.set("test-key", {"value": 123}, ttl_seconds=60)

    assert cache.get("test-key") == {"value": 123}


def test_cache_miss_returns_none():
    cache = InMemoryCache()

    assert cache.get("missing-key") is None


def test_cache_clear():
    cache = InMemoryCache()

    cache.set("test-key", "hello", ttl_seconds=60)
    cache.clear()

    assert cache.get("test-key") is None