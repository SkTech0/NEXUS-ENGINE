"""
Cache engine — get/set/delete with optional TTL.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from time import monotonic
from typing import Any, Generic, TypeVar

from errors.error_model import ValidationError

K = TypeVar("K")
V = TypeVar("V")

_logger = logging.getLogger("engine-data")


@dataclass
class CacheEntry(Generic[V]):
    """Cached value with optional expiry (monotonic time)."""

    value: V
    expires_at: float | None = None

    def is_expired(self) -> bool:
        """True if TTL passed. Testable."""
        if self.expires_at is None:
            return False
        return monotonic() >= self.expires_at


class CacheEngine(Generic[K, V]):
    """
    In-memory cache: get, set, delete, optional ttl_seconds.
    Testable.
    """

    def __init__(self, default_ttl_seconds: float | None = None) -> None:
        self._default_ttl = default_ttl_seconds
        self._store: dict[K, CacheEntry[V]] = {}

    def get(self, key: K) -> V | None:
        """Get value; return None if missing or expired. Testable."""
        entry = self._store.get(key)
        if entry is None:
            return None
        if entry.is_expired():
            del self._store[key]
            return None
        return entry.value

    def set(
        self,
        key: K,
        value: V,
        ttl_seconds: float | None = None,
    ) -> None:
        """Set value with optional TTL. Rejects negative TTL."""
        ttl = ttl_seconds if ttl_seconds is not None else self._default_ttl
        if ttl is not None and ttl < 0:
            raise ValidationError("ttl_seconds must be non-negative", details={"field": "ttl_seconds"})
        expires = (monotonic() + ttl) if ttl is not None else None
        self._store[key] = CacheEntry(value=value, expires_at=expires)
        _logger.debug("cache_engine.set key=%s ttl=%s", key, ttl)

    def delete(self, key: K) -> bool:
        """Delete key. Returns True if key was present."""
        if key in self._store:
            del self._store[key]
            _logger.debug("cache_engine.delete key=%s", key)
            return True
        return False

    def clear(self) -> None:
        """Remove all entries. Testable."""
        self._store.clear()

    def size(self) -> int:
        """Number of entries (including expired until next get). Testable."""
        return len(self._store)


def create_cache_engine(
    default_ttl_seconds: float | None = None,
) -> CacheEngine[Any, Any]:
    """Create cache engine. Testable."""
    return CacheEngine(default_ttl_seconds=default_ttl_seconds)
