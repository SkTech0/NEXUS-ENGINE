"""
Engine-core port bindings for engine-ai-service.
Defines interfaces only; implementations live in engine-core / adapters.
"""
from typing import Any, Protocol


class AIInferPort(Protocol):
    def infer(self, model_id: str, inputs: dict[str, Any]) -> dict[str, Any]: ...
    def list_models(self) -> list[str]: ...
