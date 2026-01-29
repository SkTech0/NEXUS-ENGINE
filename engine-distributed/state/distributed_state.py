"""
Distributed state — versioned key-value state with merge (CRDT-style).
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class VersionedValue:
    """Value with a version (e.g. vector clock or scalar)."""

    value: Any
    version: int | dict[str, int]  # scalar or vector clock


@dataclass
class DistributedState:
    """
    In-memory distributed state: key -> VersionedValue.
    Merge by taking max version (scalar) or vector merge.
    """

    _state: dict[str, VersionedValue] = field(default_factory=dict)
    _version: int = 0

    def get(self, key: str) -> Any | None:
        """Get value for key. Returns None if missing. Testable."""
        vv = self._state.get(key)
        return vv.value if vv is not None else None

    def get_versioned(self, key: str) -> VersionedValue | None:
        """Get versioned value. Testable."""
        return self._state.get(key)

    def set(self, key: str, value: Any, version: int | dict[str, int] | None = None) -> None:
        """Set key to value with optional version. Testable."""
        if version is None:
            self._version += 1
            version = self._version
        self._state[key] = VersionedValue(value=value, version=version)

    def delete(self, key: str) -> bool:
        """Remove key. Returns True if key was present. Testable."""
        if key in self._state:
            del self._state[key]
            return True
        return False

    def keys(self) -> list[str]:
        """All keys. Testable."""
        return list(self._state.keys())

    def merge_scalar(self, key: str, value: Any, version: int) -> None:
        """
        Merge remote update: accept if version > current or key missing.
        Scalar version only. Testable.
        """
        current = self._state.get(key)
        if current is None or (isinstance(current.version, int) and version > current.version):
            self._state[key] = VersionedValue(value=value, version=version)

    def merge_vector(self, key: str, value: Any, remote_clock: dict[str, int]) -> None:
        """
        Merge using vector clock: accept if remote is not before local.
        Simplified: if we don't have key or remote clock has any higher component, accept.
        Testable.
        """
        current = self._state.get(key)
        if current is None:
            self._state[key] = VersionedValue(value=value, version=remote_clock)
            return
        if not isinstance(current.version, dict):
            self._state[key] = VersionedValue(value=value, version=remote_clock)
            return
        # Accept if remote has at least one component strictly greater
        for node_id, tick in remote_clock.items():
            if tick > current.version.get(node_id, 0):
                self._state[key] = VersionedValue(value=value, version=remote_clock)
                return

    def snapshot(self) -> dict[str, Any]:
        """Return shallow copy of key -> value. Testable."""
        return {k: vv.value for k, vv in self._state.items()}


def create_distributed_state() -> DistributedState:
    """Create empty distributed state. Testable."""
    return DistributedState()
