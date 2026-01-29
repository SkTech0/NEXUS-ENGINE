"""
Compliance engine — check actions and state against compliance rules.
Modular, testable. Canonical: enterprise/compliance.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class ComplianceRule:
    """A rule: id, check function, severity, message."""

    id: str
    check: Callable[[Any], bool]
    severity: str = "error"
    message: str = ""


@dataclass
class ComplianceResult:
    """Result: compliant flag and list of violations."""

    compliant: bool = True
    violations: list[dict[str, Any]] = field(default_factory=list)

    def add_violation(self, rule_id: str, message: str, severity: str = "error") -> None:
        """Add violation. Testable."""
        self.violations.append({"rule_id": rule_id, "message": message, "severity": severity})
        self.compliant = False


class ComplianceEngine:
    """
    Compliance: add rules; check(subject) returns ComplianceResult.
    Testable.
    """

    def __init__(self) -> None:
        self._rules: list[ComplianceRule] = []

    def add_rule(self, rule: ComplianceRule) -> None:
        """Add compliance rule. Testable."""
        self._rules.append(rule)

    def check(self, subject: Any) -> ComplianceResult:
        """Run all rules; return result with violations. Testable."""
        result = ComplianceResult()
        for rule in self._rules:
            if not rule.check(subject):
                result.add_violation(rule.id, rule.message or f"Rule {rule.id} failed", rule.severity)
        return result

    def rules(self) -> list[str]:
        """Rule ids. Testable."""
        return [r.id for r in self._rules]


def create_compliance_engine() -> ComplianceEngine:
    """Create compliance engine. Testable."""
    return ComplianceEngine()
