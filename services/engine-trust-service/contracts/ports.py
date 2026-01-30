"""Engine-core port bindings for engine-trust-service."""
from typing import Any, Protocol


class TrustVerifyPort(Protocol):
    def verify(self, payload: dict[str, Any]) -> dict[str, Any]: ...
    def get_score(self, entity_id: str) -> dict[str, Any]: ...
