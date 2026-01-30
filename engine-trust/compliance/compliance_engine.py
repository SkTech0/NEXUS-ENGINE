"""
Compliance engine — check actions or state against rules.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-trust")


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
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._rules: list[Rule] = []

    def add_rule(self, rule: Rule) -> None:
        """Add rule. Validates rule and id before state mutation."""
        if rule is None:
            raise ValidationError("rule is required", details={"field": "rule"})
        if not (getattr(rule, "id", None) or "").strip():
            raise ValidationError("rule id is required", details={"field": "id"})
        if getattr(rule, "check", None) is None:
            raise ValidationError("rule check function is required", details={"field": "check"})
        self._rules.append(rule)
        _logger.debug("compliance_engine.add_rule id=%s", rule.id)

    def check(self, subject: Any) -> ComplianceResult:
        """Run all rules; return result with violations. Logs result."""
        result = ComplianceResult(compliant=True)
        for rule in self._rules:
            if not rule.check(subject):
                result.add_violation(rule.message or f"Rule {rule.id} failed")
        _logger.info("compliance_engine.check compliant=%s violations=%s", result.compliant, len(result.violations))
        return result

    def rules(self) -> list[str]:
        """Rule ids. Testable."""
        return [r.id for r in self._rules]


def create_compliance_engine() -> ComplianceEngine:
    """Create compliance engine. Testable."""
    return ComplianceEngine()
