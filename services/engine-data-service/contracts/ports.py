"""Engine-core port bindings for engine-data-service."""
from typing import Any, Protocol


class DataQueryPort(Protocol):
    def query(self, query_spec: dict[str, Any]) -> dict[str, Any]: ...
    def index(self, payload: dict[str, Any]) -> dict[str, Any]: ...
