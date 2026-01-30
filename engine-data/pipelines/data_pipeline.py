"""
Data pipeline — stages and execution.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Callable, Generic, TypeVar

from errors.error_model import ExecutionError, ValidationError

T = TypeVar("T")
U = TypeVar("U")

_logger = logging.getLogger("engine-data")


@dataclass
class PipelineStage(Generic[T, U]):
    """A single stage: name and transform function."""

    name: str
    transform: Callable[[T], U]

    def run(self, data: T) -> U:
        """Execute stage. Validates transform present; maps failures to ExecutionError."""
        if self.transform is None:
            raise ValidationError("transform is required", details={"stage": self.name})
        try:
            return self.transform(data)
        except ValidationError:
            raise
        except Exception as e:
            _logger.error("data_pipeline.stage_run stage=%s error=%s", self.name, e, exc_info=True)
            raise ExecutionError(str(e), cause=type(e).__name__, retryable=True) from e


class DataPipeline(Generic[T]):
    """
    Linear pipeline: list of stages; run passes data through each.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self, name: str = "default") -> None:
        self.name = name or "default"
        self._stages: list[tuple[str, Callable[[Any], Any]]] = []
        _logger.debug("data_pipeline.init name=%s", self.name)

    def add_stage(self, name: str, transform: Callable[[Any], Any]) -> DataPipeline[T]:
        """Add stage. Validates name and transform before mutation."""
        if not (name or "").strip():
            raise ValidationError("stage name is required", details={"field": "name"})
        if transform is None:
            raise ValidationError("transform is required", details={"stage": name})
        self._stages.append((name, transform))
        return self

    def run(self, initial: T) -> Any:
        """Run pipeline. Validates stages; maps failures to ExecutionError."""
        data: Any = initial
        for _name, transform in self._stages:
            try:
                data = transform(data)
            except ValidationError:
                raise
            except Exception as e:
                _logger.error("data_pipeline.run stage=%s error=%s", _name, e, exc_info=True)
                raise ExecutionError(str(e), cause=type(e).__name__, retryable=True) from e
        _logger.info("data_pipeline.run name=%s stages=%s", self.name, len(self._stages))
        return data

    def stages(self) -> list[str]:
        """Stage names in order."""
        return [name for name, _ in self._stages]


def create_pipeline(name: str = "default") -> DataPipeline[Any]:
    """Create empty pipeline. Testable."""
    return DataPipeline(name=name)


def map_stage(name: str, fn: Callable[[T], U]) -> PipelineStage[T, U]:
    """Create a map stage. Testable."""
    return PipelineStage(name=name, transform=fn)
