"""Health endpoint for engine-intelligence-service."""
from typing import Any


def get_health() -> dict[str, Any]:
    return {"status": "healthy", "service": "engine-intelligence-service"}
