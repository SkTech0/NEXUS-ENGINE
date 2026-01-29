"""
API registry — register and discover API endpoints/versions.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ApiEndpoint:
    """API endpoint: id, path, method, version, metadata."""

    id: str
    path: str
    method: str = "GET"
    version: str = "v1"
    metadata: dict[str, Any] = field(default_factory=dict)


class ApiRegistry:
    """
    API registry: register, get, list by path/version.
    Testable.
    """

    def __init__(self) -> None:
        self._endpoints: dict[str, ApiEndpoint] = {}
        self._by_path: dict[str, list[str]] = {}

    def register(self, endpoint: ApiEndpoint) -> None:
        """Register endpoint; id must be unique. Testable."""
        self._endpoints[endpoint.id] = endpoint
        key = (endpoint.path, endpoint.method)
        self._by_path.setdefault(key, []).append(endpoint.id)

    def get(self, endpoint_id: str) -> ApiEndpoint | None:
        """Get endpoint by id. Testable."""
        return self._endpoints.get(endpoint_id)

    def get_by_path(self, path: str, method: str = "GET") -> list[ApiEndpoint]:
        """Get endpoints by path and method. Testable."""
        key = (path, method)
        ids = self._by_path.get(key, [])
        return [self._endpoints[i] for i in ids if i in self._endpoints]

    def list_endpoints(self, version: str | None = None) -> list[ApiEndpoint]:
        """List endpoints; optional version filter. Testable."""
        if version is None:
            return list(self._endpoints.values())
        return [e for e in self._endpoints.values() if e.version == version]

    def unregister(self, endpoint_id: str) -> bool:
        """Remove endpoint. Returns True if found. Testable."""
        endpoint = self._endpoints.pop(endpoint_id, None)
        if endpoint is None:
            return False
        key = (endpoint.path, endpoint.method)
        if key in self._by_path:
            try:
                self._by_path[key].remove(endpoint_id)
            except ValueError:
                pass
        return True


def create_api_registry() -> ApiRegistry:
    """Create API registry. Testable."""
    return ApiRegistry()
