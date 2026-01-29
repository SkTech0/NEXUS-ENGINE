"""
AI pipeline — chain stages: load -> preprocess -> infer -> postprocess.
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable, Generic, TypeVar

T = TypeVar("T")
U = TypeVar("U")


@dataclass
class PipelineStage(Generic[T, U]):
    """A stage: name and transform."""

    name: str
    transform: Callable[[T], U]

    def run(self, data: T) -> U:
        """Execute stage. Testable."""
        return self.transform(data)


class AIPipeline:
    """
    Linear pipeline: add stages; run(input) passes data through each stage.
    Testable.
    """

    def __init__(self, name: str = "default") -> None:
        self.name = name
        self._stages: list[tuple[str, Callable[[Any], Any]]] = []

    def add_stage(self, name: str, transform: Callable[[Any], Any]) -> "AIPipeline":
        """Add stage. Returns self for chaining. Testable."""
        self._stages.append((name, transform))
        return self

    def run(self, input_data: Any) -> Any:
        """Run pipeline. Testable."""
        data = input_data
        for _name, transform in self._stages:
            data = transform(data)
        return data

    def stages(self) -> list[str]:
        """Stage names in order. Testable."""
        return [n for n, _ in self._stages]


def create_ai_pipeline(name: str = "default") -> AIPipeline:
    """Create empty pipeline. Testable."""
    return AIPipeline(name=name)
