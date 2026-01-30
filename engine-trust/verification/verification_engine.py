"""
Verification engine — verify claims, tokens, or proofs.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Callable

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-trust")


@dataclass
class VerificationResult:
    """Result: valid flag and optional message."""

    valid: bool
    message: str = ""


class VerificationEngine:
    """
    Verification: register verifiers; verify(claim_type, payload) returns result.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._verifiers: dict[str, Callable[[Any], VerificationResult]] = {}

    def add_verifier(self, claim_type: str, fn: Callable[[Any], VerificationResult]) -> None:
        """Register verifier for claim type. Validates claim_type and fn before mutation."""
        if not (claim_type or "").strip():
            raise ValidationError("claim_type is required", details={"field": "claim_type"})
        if fn is None:
            raise ValidationError("verifier fn is required", details={"field": "fn"})
        self._verifiers[claim_type] = fn
        _logger.debug("verification_engine.add_verifier claim_type=%s", claim_type)

    def verify(self, claim_type: str, payload: Any) -> VerificationResult:
        """Run verifier for claim type. Validates claim_type non-empty."""
        if not (claim_type or "").strip():
            raise ValidationError("claim_type is required", details={"field": "claim_type"})
        fn = self._verifiers.get(claim_type)
        if fn is None:
            _logger.warning("verification_engine.verify unknown_claim_type=%s", claim_type)
            return VerificationResult(valid=False, message=f"Unknown claim type: {claim_type}")
        return fn(payload)

    def list_claim_types(self) -> list[str]:
        """Registered claim types. Testable."""
        return list(self._verifiers.keys())


def create_verification_engine() -> VerificationEngine:
    """Create verification engine. Testable."""
    return VerificationEngine()
