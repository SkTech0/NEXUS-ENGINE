"""
Optimizer — minimize/maximize objective subject to constraints.
Modular, testable; generic interface.
"""
from dataclasses import dataclass
from typing import Any, Callable, Generic, TypeVar

T = TypeVar("T")


@dataclass
class OptimizationResult(Generic[T]):
    """Result: solution, objective value, feasible flag."""

    solution: T
    value: float
    feasible: bool = True


class Optimizer(Generic[T]):
    """
    Optimizer: set objective and optional constraints; solve(initial) returns result.
    Testable.
    """

    def __init__(
        self,
        objective: Callable[[T], float],
        minimize: bool = True,
    ) -> None:
        self._objective = objective
        self._minimize = minimize
        self._constraints: list[Callable[[T], bool]] = []

    def add_constraint(self, fn: Callable[[T], bool]) -> None:
        """Add constraint: solution feasible iff fn(solution) is True. Testable."""
        self._constraints.append(fn)

    def feasible(self, solution: T) -> bool:
        """Check all constraints. Testable."""
        return all(c(solution) for c in self._constraints)

    def evaluate(self, solution: T) -> float:
        """Objective value (negated if maximize). Testable."""
        v = self._objective(solution)
        return -v if not self._minimize else v

    def solve(self, initial: T, step_fn: Callable[[T], T] | None = None) -> OptimizationResult[T]:
        """
        Return result for initial; if step_fn given, one step improvement.
        Full search can be implemented by callers. Testable.
        """
        current = initial
        if step_fn is not None:
            current = step_fn(initial)
        value = self.evaluate(current)
        return OptimizationResult(
            solution=current,
            value=value,
            feasible=self.feasible(current),
        )


def create_optimizer(
    objective: Callable[[T], float],
    minimize: bool = True,
) -> Optimizer[T]:
    """Create optimizer. Testable."""
    return Optimizer(objective=objective, minimize=minimize)
