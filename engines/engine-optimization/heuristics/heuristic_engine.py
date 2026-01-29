"""
Heuristic engine — apply heuristics to improve or explore solutions.
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable, Generic, TypeVar

T = TypeVar("T")


@dataclass
class HeuristicResult(Generic[T]):
    """Result of applying a heuristic: solution and score."""

    solution: T
    score: float


class HeuristicEngine(Generic[T]):
    """
    Register heuristics; apply(solution) returns best improved solution.
    Testable.
    """

    def __init__(self) -> None:
        self._heuristics: list[tuple[str, Callable[[T], HeuristicResult[T] | None]]] = []

    def add_heuristic(self, name: str, fn: Callable[[T], HeuristicResult[T] | None]) -> None:
        """Add heuristic. Returns improved solution or None. Testable."""
        self._heuristics.append((name, fn))

    def apply(self, solution: T, scorer: Callable[[T], float]) -> T:
        """
        Try each heuristic; return solution with best score (or original).
        Testable.
        """
        best = solution
        best_score = scorer(best)
        for _name, fn in self._heuristics:
            result = fn(solution)
            if result is not None and result.score > best_score:
                best = result.solution
                best_score = result.score
        return best

    def apply_chain(self, solution: T) -> T:
        """Apply heuristics in order, passing output to next. Testable."""
        current = solution
        for _name, fn in self._heuristics:
            result = fn(current)
            if result is not None:
                current = result.solution
        return current


def create_heuristic_engine() -> HeuristicEngine[Any]:
    """Create empty heuristic engine. Testable."""
    return HeuristicEngine()
