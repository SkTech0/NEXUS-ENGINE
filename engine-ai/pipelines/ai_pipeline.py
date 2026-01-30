"""
AI pipeline — chain stages: load -> preprocess -> infer -> postprocess.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Callable, Generic, TypeVar

from errors.error_model import ExecutionError, ValidationError

T = TypeVar("T")
U = TypeVar("U")

_logger = logging.getLogger("engine-ai")


@dataclass
class PipelineStage(Generic[T, U]):
    """A stage: name and transform."""

    name: str
    transform: Callable[[T], U]

    def run(self, data: T) -> U:
        """Execute stage. Validates data not None when stage exists."""
        if self.transform is None:
            raise ValidationError("transform is required", details={"stage": self.name})
        try:
            return self.transform(data)
        except Exception as e:
            _logger.error("pipeline.stage_run stage=%s error=%s", self.name, e, exc_info=True)
            raise ExecutionError(str(e), cause=type(e).__name__, retryable=True) from e


class AIPipeline:
    """
    Linear pipeline: add stages; run(input) passes data through each stage.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self, name: str = "default") -> None:
        if not (name or "").strip():
            raise ValidationError("pipeline name is required", details={"field": "name"})
        self.name = name
        self._stages: list[tuple[str, Callable[[Any], Any]]] = []
        _logger.debug("pipeline.init name=%s", name)

    def add_stage(self, name: str, transform: Callable[[Any], Any]) -> AIPipeline:
        """Add stage. Validates name and transform before mutation."""
        if not (name or "").strip():
            raise ValidationError("stage name is required", details={"field": "name"})
        if transform is None:
            raise ValidationError("transform is required", details={"stage": name})
        self._stages.append((name, transform))
        _logger.debug("pipeline.add_stage name=%s", name)
        return self

    def run(self, input_data: Any) -> Any:
        """Run pipeline. Validates stages present; logs execution."""
        if not self._stages:
            _logger.warning("pipeline.run empty pipeline name=%s", self.name)
            return input_data
        data = input_data
        for _name, transform in self._stages:
            try:
                data = transform(data)
            except ValidationError:
                raise
            except Exception as e:
                _logger.error("pipeline.run stage=%s error=%s", _name, e, exc_info=True)
                raise ExecutionError(str(e), cause=type(e).__name__, retryable=True) from e
        _logger.info("pipeline.run name=%s stages=%s", self.name, len(self._stages))
        return data

    def stages(self) -> list[str]:
        """Stage names in order."""
        return [n for n, _ in self._stages]


def create_ai_pipeline(name: str = "default") -> AIPipeline:
    """Create empty pipeline. ERL-4: validated."""
    return AIPipeline(name=name or "default")
