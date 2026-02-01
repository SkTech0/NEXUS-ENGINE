"""
Engine Optimization — Constraint validation and safe bounds (ERL-4).
Constraint validation, safe optimization bounds, scheduler safety.
"""
from __future__ import annotations

from typing import Any

from validation.validation_layer import ValidationIssue, ValidationResult

# Safe bounds for loan/risk parameters (configurable via override)
CREDIT_SCORE_MIN = 0
CREDIT_SCORE_MAX = 850
INCOME_TO_LOAN_MIN = 0.0
INCOME_TO_LOAN_MAX = 2.0
EXISTING_LOANS_MIN = 0
EXISTING_LOANS_MAX = 50


def validate_constraints(payload: Any) -> ValidationResult:
    """
    Validate optimization constraints. Ensures numeric bounds and structure.
    """
    if payload is None:
        return ValidationResult(
            valid=False,
            issues=[ValidationIssue(message="payload is null", code="NULL_PAYLOAD")],
        )
    if not isinstance(payload, dict):
        return ValidationResult(
            valid=False,
            issues=[ValidationIssue(message="constraints must be a dict", code="INVALID_TYPE")],
        )
    issues: list[ValidationIssue] = []
    if "creditScore" in payload:
        v = payload["creditScore"]
        try:
            f = float(v)
            if not (CREDIT_SCORE_MIN <= f <= CREDIT_SCORE_MAX):
                issues.append(
                    ValidationIssue(
                        message=f"creditScore must be in [{CREDIT_SCORE_MIN}, {CREDIT_SCORE_MAX}]",
                        code="OUT_OF_BOUNDS",
                        path="creditScore",
                    )
                )
        except (TypeError, ValueError):
            issues.append(
                ValidationIssue(message="creditScore must be numeric", code="INVALID_TYPE", path="creditScore")
            )
    if "incomeToLoan" in payload:
        v = payload["incomeToLoan"]
        try:
            f = float(v)
            if not (INCOME_TO_LOAN_MIN <= f <= INCOME_TO_LOAN_MAX):
                issues.append(
                    ValidationIssue(
                        message=f"incomeToLoan must be in [{INCOME_TO_LOAN_MIN}, {INCOME_TO_LOAN_MAX}]",
                        code="OUT_OF_BOUNDS",
                        path="incomeToLoan",
                    )
                )
        except (TypeError, ValueError):
            issues.append(
                ValidationIssue(message="incomeToLoan must be numeric", code="INVALID_TYPE", path="incomeToLoan")
            )
    if "existingLoans" in payload:
        v = payload["existingLoans"]
        try:
            i = int(v)
            if not (EXISTING_LOANS_MIN <= i <= EXISTING_LOANS_MAX):
                issues.append(
                    ValidationIssue(
                        message=f"existingLoans must be in [{EXISTING_LOANS_MIN}, {EXISTING_LOANS_MAX}]",
                        code="OUT_OF_BOUNDS",
                        path="existingLoans",
                    )
                )
        except (TypeError, ValueError):
            issues.append(
                ValidationIssue(message="existingLoans must be integer", code="INVALID_TYPE", path="existingLoans")
            )
    if issues:
        return ValidationResult(valid=False, issues=issues)
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
