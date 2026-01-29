"""
Distributed lock — acquire/release with optional TTL.
Modular, in-memory implementation for testing; replace with Redis/etcd adapter in production.
"""
from dataclasses import dataclass, field
from time import monotonic
from typing import Any


@dataclass
class LockState:
    """Current holder and expiry (monotonic time)."""

    holder: str | None = None
    expires_at: float | None = None


class DistributedLockBackend:
    """
    In-memory lock backend. Testable.
    Production would use Redis, etcd, or similar.
    """

    def __init__(self) -> None:
        self._locks: dict[str, LockState] = {}

    def acquire(
        self,
        lock_id: str,
        holder: str,
        ttl_seconds: float | None = None,
    ) -> bool:
        """
        Acquire lock. Returns True if acquired.
        If ttl_seconds given, lock expires after that many seconds (monotonic).
        """
        now = monotonic()
        state = self._locks.get(lock_id)
        if state is not None:
            if state.holder == holder:
                self._refresh(lock_id, holder, ttl_seconds)
                return True
            if state.expires_at is not None and now < state.expires_at:
                return False
        self._locks[lock_id] = LockState(
            holder=holder,
            expires_at=now + ttl_seconds if ttl_seconds is not None else None,
        )
        return True

    def _refresh(self, lock_id: str, holder: str, ttl_seconds: float | None) -> None:
        now = monotonic()
        self._locks[lock_id] = LockState(
            holder=holder,
            expires_at=now + ttl_seconds if ttl_seconds is not None else None,
        )

    def release(self, lock_id: str, holder: str) -> bool:
        """Release lock. Returns True if this holder had the lock and released it."""
        state = self._locks.get(lock_id)
        if state is None or state.holder != holder:
            return False
        del self._locks[lock_id]
        return True

    def is_held_by(self, lock_id: str, holder: str) -> bool:
        """Check if lock is held by holder (and not expired). Testable."""
        state = self._locks.get(lock_id)
        if state is None or state.holder != holder:
            return False
        if state.expires_at is not None and monotonic() >= state.expires_at:
            del self._locks[lock_id]
            return False
        return True

    def get_holder(self, lock_id: str) -> str | None:
        """Return current holder or None. Testable."""
        state = self._locks.get(lock_id)
        if state is None:
            return None
        if state.expires_at is not None and monotonic() >= state.expires_at:
            del self._locks[lock_id]
            return None
        return state.holder


def create_distributed_lock_backend() -> DistributedLockBackend:
    """Create an in-memory lock backend. Testable."""
    return DistributedLockBackend()
