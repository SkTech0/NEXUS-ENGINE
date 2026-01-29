"""
Data pipeline — stages and execution.
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable, Generic, TypeVar

T = TypeVar("T")
U = TypeVar("U")


@dataclass
class PipelineStage(Generic[T, U]):
    """A single stage: name and transform function."""

    name: str
    transform: Callable[[T], U]

    def run(self, data: T) -> U:
        """Execute stage. Testable."""
        return self.transform(data)


class DataPipeline(Generic[T]):
    """
    Linear pipeline: list of stages; run passes data through each.
    Testable.
    """

    def __init__(self, name: str = "default") -> None:
        self.name = name
        self._stages: list[tuple[str, Callable[[Any], Any]]] = []

    def add_stage(self, name: str, transform: Callable[[Any], Any]) -> "DataPipeline[T]":
        """Add stage. Returns self for chaining. Testable."""
        self._stages.append((name, transform))
        return self

    def run(self, initial: T) -> Any:
        """Run pipeline: initial -> stage1 -> stage2 -> ... Testable."""
        data: Any = initial
        for _name, transform in self._stages:
            data = transform(data)
        return data

    def stages(self) -> list[str]:
        """Stage names in order. Testable."""
        return [name for name, _ in self._stages]


def create_pipeline(name: str = "default") -> DataPipeline[Any]:
    """Create empty pipeline. Testable."""
    return DataPipeline(name=name)


def map_stage(name: str, fn: Callable[[T], U]) -> PipelineStage[T, U]:
    """Create a map stage. Testable."""
    return PipelineStage(name=name, transform=fn)
