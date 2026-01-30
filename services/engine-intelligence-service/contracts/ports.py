"""Engine-core port bindings for engine-intelligence-service."""
from typing import Any, Protocol


class IntelligenceEvaluatePort(Protocol):
    def evaluate(self, context: str, inputs: dict[str, Any]) -> dict[str, Any]: ...


class EngineExecutePort(Protocol):
    def execute(self, input: Any) -> Any: ...
