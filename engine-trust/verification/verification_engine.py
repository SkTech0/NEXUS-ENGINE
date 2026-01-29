"""
Verification engine — verify claims, tokens, or proofs.
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable


@dataclass
class VerificationResult:
    """Result: valid flag and optional message."""

    valid: bool
    message: str = ""


class VerificationEngine:
    """
    Verification: register verifiers; verify(claim_type, payload) returns result.
    Testable.
    """

    def __init__(self) -> None:
        self._verifiers: dict[str, Callable[[Any], VerificationResult]] = {}

    def add_verifier(self, claim_type: str, fn: Callable[[Any], VerificationResult]) -> None:
        """Register verifier for claim type. Testable."""
        self._verifiers[claim_type] = fn

    def verify(self, claim_type: str, payload: Any) -> VerificationResult:
        """Run verifier for claim type. Testable."""
        fn = self._verifiers.get(claim_type)
        if fn is None:
            return VerificationResult(valid=False, message=f"Unknown claim type: {claim_type}")
        return fn(payload)

    def list_claim_types(self) -> list[str]:
        """Registered claim types. Testable."""
        return list(self._verifiers.keys())


def create_verification_engine() -> VerificationEngine:
    """Create verification engine. Testable."""
    return VerificationEngine()
