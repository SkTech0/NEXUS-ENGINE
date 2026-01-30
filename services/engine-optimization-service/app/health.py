"""Health endpoint for engine-optimization-service."""
from typing import Any


def get_health() -> dict[str, Any]:
    return {"status": "healthy", "service": "engine-optimization-service"}
