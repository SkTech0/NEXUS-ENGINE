"""Health endpoint for engine-trust-service."""
from typing import Any


def get_health() -> dict[str, Any]:
    return {"status": "healthy", "service": "engine-trust-service", "confidence": 0.85}
