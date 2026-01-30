"""Engine-core port bindings for engine-optimization-service."""
from typing import Any, Protocol


class OptimizationPort(Protocol):
    def optimize(self, target_id: str, objective: str, constraints: dict[str, Any]) -> dict[str, Any]: ...
