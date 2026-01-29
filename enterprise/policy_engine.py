"""
Policy engine — evaluate policies against context (allow/deny).
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class Policy:
    """A policy: id, effect (allow/deny), condition function."""

    id: str
    effect: str  # "allow" | "deny"
    condition: Callable[[Any], bool]


@dataclass
class PolicyResult:
    """Policy result: allowed, matched policy ids, denied by."""

    allowed: bool = True
    matched: list[str] = field(default_factory=list)
    denied_by: list[str] = field(default_factory=list)


class PolicyEngine:
    """
    Policy engine: add policies; evaluate(context) returns PolicyResult.
    Deny overrides allow. Testable.
    """

    def __init__(self) -> None:
        self._policies: list[Policy] = []

    def add_policy(self, policy: Policy) -> None:
        """Add policy. Testable."""
        self._policies.append(policy)

    def evaluate(self, context: Any) -> PolicyResult:
        """
        Evaluate all policies. Any matching deny -> denied; else any matching allow -> allowed.
        Testable.
        """
        result = PolicyResult()
        for p in self._policies:
            if not p.condition(context):
                continue
            result.matched.append(p.id)
            if p.effect == "deny":
                result.denied_by.append(p.id)
                result.allowed = False
        if result.allowed and result.matched:
            result.allowed = any(p.effect == "allow" for p in self._policies if p.id in result.matched)
        return result


def create_policy_engine() -> PolicyEngine:
    """Create policy engine. Testable."""
    return PolicyEngine()
