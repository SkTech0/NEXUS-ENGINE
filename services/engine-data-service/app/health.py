"""Health endpoint for engine-data-service."""
from typing import Any


def get_health() -> dict[str, Any]:
    return {"status": "healthy", "service": "engine-data-service"}
