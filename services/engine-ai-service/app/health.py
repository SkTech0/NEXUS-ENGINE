"""
Health endpoint for engine-ai-service.
Emits health status for observability and gateway.
"""
from typing import Any


def get_health() -> dict[str, Any]:
    return {"status": "healthy", "service": "engine-ai-service"}
