"""
Engine AI — Inference validation (ERL-4).
Request validation, model existence check hook.
"""
from __future__ import annotations

from typing import Any, Callable

from validation.validation_layer import ValidationIssue, ValidationResult

from inference.inference_service import InferenceRequest


def validate_inference_request(
    request: InferenceRequest,
    *,
    model_exists: Callable[[str], bool] | None = None,
) -> ValidationResult:
    """
    Validate inference request: non-null, model_id present, optional model existence.
    """
    if request is None:
        return ValidationResult(valid=False, issues=[ValidationIssue(message="request is null", code="NULL_REQUEST")])
    if not getattr(request, "model_id", None):
        return ValidationResult(valid=False, issues=[ValidationIssue(message="model_id required", code="MISSING_MODEL_ID")])
    if not getattr(request, "inputs", None):
        return ValidationResult(valid=False, issues=[ValidationIssue(message="inputs required", code="MISSING_INPUTS")])
    if model_exists is not None and not model_exists(request.model_id):
        return ValidationResult(
            valid=False,
            issues=[ValidationIssue(message=f"model not found: {request.model_id}", code="MODEL_NOT_FOUND")],
        )
    return ValidationResult(valid=True)


def drift_detection_hook(
    model_id: str,
    inputs: dict[str, Any],
    outputs: dict[str, Any],
) -> bool:
    """
    Stub for drift detection (ERL-4). Returns True if no drift detected.
    Override in engines for real drift checks.
    """
    return True
