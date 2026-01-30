"""Health endpoint for engine-distributed-service."""
from typing import Any


def get_health() -> dict[str, Any]:
    return {"status": "healthy", "service": "engine-distributed-service"}
