"""
Adapter layer for engine-ai-service.
Delegates to engine-core port bindings via adapters.
"""
from typing import Any

# Adapter will be injected; this module defines the service interface only.
# No business logic here — only orchestration to engine adapter.


def infer(model_id: str, inputs: dict[str, Any]) -> dict[str, Any]:
    """Delegate to engine adapter. Stub response if adapter unavailable."""
    return {"outputs": inputs, "latencyMs": 0.0, "modelId": model_id}


def list_models() -> dict[str, Any]:
    return {"modelIds": ["default"]}
