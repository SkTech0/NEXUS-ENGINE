"""
Engine Distributed — Runtime context (ERL-4).
Correlation, config, feature flags.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

ENGINE_NAME = "engine-distributed"
ENGINE_VERSION = "1.0.0"


@dataclass
class EngineRuntimeContext:
    trace_id: str
    correlation_id: str | None = None
    environment: str = "dev"
    engine_name: str = ENGINE_NAME
    engine_version: str = ENGINE_VERSION
    feature_flags: dict[str, bool] = field(default_factory=dict)
    config: dict[str, Any] = field(default_factory=dict)

    def get_trace_id(self) -> str:
        return self.trace_id

    def get_correlation_id(self) -> str | None:
        return self.correlation_id

    def get_environment(self) -> str:
        return self.environment

    def is_feature_enabled(self, name: str) -> bool:
        return self.feature_flags.get(name, False)
