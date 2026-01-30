"""
Connects engine-ai-service to engine-core contracts.
Adapter only; no business logic. Optional use by app/service.py.
"""
from typing import Any

# When engine-ai is loaded as library, bind here.
# This module is a shell; actual binding is additive and does not change engine-ai.


def bind_ai_port() -> Any:
    """Return an implementation of AIInferPort if available; else None."""
    return None


def infer_via_engine(model_id: str, inputs: dict[str, Any]) -> dict[str, Any]:
    """Call engine-ai if bound; otherwise return stub."""
    port = bind_ai_port()
    if port is not None:
        return port.infer(model_id, inputs)
    return {"outputs": {}, "latencyMs": 0.0, "modelId": model_id}
