"""
Engine Optimization — Constraint validation and safe bounds (ERL-4).
Constraint validation, safe optimization bounds, scheduler safety.
"""
from __future__ import annotations

from typing import Any

from validation.validation_layer import ValidationIssue, ValidationResult


def validate_constraints(payload: Any) -> ValidationResult:
    """
    Validate optimization constraints. Stub; override in engines.
    """
    if payload is None:
        return ValidationResult(valid=False, issues=[ValidationIssue(message="payload is null", code="NULL_PAYLOAD")])
    return ValidationResult(valid=True)


def safe_optimization_bounds(
    lower: float | None = None,
    upper: float | None = None,
    value: float = 0.0,
) -> bool:
    """
    Check value is within safe optimization bounds. ERL-4 safe bounds.
    """
    if lower is not None and value < lower:
        return False
    if upper is not None and value > upper:
        return False
    return True


def scheduler_safety_check(job_count: int, max_jobs: int = 10_000) -> bool:
    """
    Scheduler safety: job count within limit. ERL-4 scheduler safety.
    """
    return 0 <= job_count <= max_jobs
