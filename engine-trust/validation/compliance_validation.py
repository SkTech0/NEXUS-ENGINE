"""
Engine Trust — Compliance rule validation (ERL-4).
Compliance rule validation, trust computation safety.
"""
from __future__ import annotations

from typing import Any

from validation.validation_layer import ValidationIssue, ValidationResult


def compliance_rule_validator(payload: Any) -> ValidationResult:
    """
    Stub: validate payload against compliance rules.
    Override in engines for real compliance checks.
    """
    if payload is None:
        return ValidationResult(valid=False, issues=[ValidationIssue(message="payload is null", code="NULL_PAYLOAD")])
    return ValidationResult(valid=True)


def identity_verification_guard(principal_id: str, context: dict[str, Any] | None = None) -> bool:
    """
    Stub: identity verification guard. Override in engines.
    Returns True if principal is verified.
    """
    return bool(principal_id and len(principal_id) > 0)
