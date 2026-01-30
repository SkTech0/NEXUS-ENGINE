"""Engine-core port bindings for engine-distributed-service."""
from typing import Any, Protocol


class DistributedReplicatePort(Protocol):
    def replicate(self, payload: dict[str, Any]) -> dict[str, Any]: ...


class DistributedCoordinatePort(Protocol):
    def coordinate(self, payload: dict[str, Any]) -> dict[str, Any]: ...
