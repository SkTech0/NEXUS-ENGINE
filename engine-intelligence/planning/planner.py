"""
Planner — goals, actions, and plans.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class Goal:
    """A goal: id and target state (or description)."""

    id: str
    target: Any = None


@dataclass
class Action:
    """An action: id, preconditions met?, effect."""

    id: str
    preconditions: Callable[[dict[str, Any]], bool]
    effect: Callable[[dict[str, Any]], dict[str, Any]]


@dataclass
class Plan:
    """A plan: ordered list of action ids."""

    action_ids: list[str] = field(default_factory=list)

    def append(self, action_id: str) -> None:
        """Append action. Testable."""
        self.action_ids.append(action_id)


class Planner:
    """
    Planning: register actions; plan(goal, state) returns a plan (ordered actions).
    Simple forward: pick actions whose preconditions hold, apply effect, until goal met.
    Testable.
    """

    def __init__(self) -> None:
        self._actions: dict[str, Action] = {}
        self._goal_check: Callable[[Any, dict[str, Any]], bool] = lambda g, s: False

    def add_action(self, action: Action) -> None:
        """Register action. Testable."""
        self._actions[action.id] = action

    def set_goal_check(self, check: Callable[[Any, dict[str, Any]], bool]) -> None:
        """Set predicate: goal_met(goal, state). Testable."""
        self._goal_check = check

    def plan(
        self,
        goal: Goal,
        initial_state: dict[str, Any],
        max_steps: int = 50,
    ) -> Plan | None:
        """
        Produce a plan: apply actions until goal_met(goal, state) or max_steps.
        Returns Plan or None if goal not reached. Testable.
        """
        state = dict(initial_state)
        plan = Plan()
        for _ in range(max_steps):
            if self._goal_check(goal.target, state):
                return plan
            applied = False
            for aid, action in self._actions.items():
                if action.preconditions(state):
                    state = action.effect(state)
                    plan.append(aid)
                    applied = True
                    break
            if not applied:
                return None
        return None


def create_planner() -> Planner:
    """Create empty planner. Testable."""
    return Planner()
