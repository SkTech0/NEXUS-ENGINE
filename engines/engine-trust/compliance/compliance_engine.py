"""
Compliance engine — check actions or state against rules.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class ComplianceResult:
    """Result: compliant flag and violations list."""

    compliant: bool
    violations: list[str] = field(default_factory=list)

    def add_violation(self, msg: str) -> None:
        """Add violation. Testable."""
        self.violations.append(msg)
        self.compliant = False


@dataclass
class Rule:
    """A rule: id and check function."""

    id: str
    check: Callable[[Any], bool]
    message: str = ""


class ComplianceEngine:
    """
    Compliance: add rules; check(subject) returns ComplianceResult.
    Testable.
    """

    def __init__(self) -> None:
        self._rules: list[Rule] = []

    def add_rule(self, rule: Rule) -> None:
        """Add rule. Testable."""
        self._rules.append(rule)

    def check(self, subject: Any) -> ComplianceResult:
        """Run all rules; return result with violations. Testable."""
        result = ComplianceResult(compliant=True)
        for rule in self._rules:
            if not rule.check(subject):
                result.add_violation(rule.message or f"Rule {rule.id} failed")
        return result

    def rules(self) -> list[str]:
        """Rule ids. Testable."""
        return [r.id for r in self._rules]


def create_compliance_engine() -> ComplianceEngine:
    """Create compliance engine. Testable."""
    return ComplianceEngine()
