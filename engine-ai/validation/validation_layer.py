"""
Engine AI — Validation layer (ERL-4).
Input/schema validation, model existence checks.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class ValidationIssue:
    path: str | None = None
    message: str = ""
    code: str | None = None


@dataclass
class ValidationResult:
    valid: bool
    issues: list[ValidationIssue] = field(default_factory=list)


class ValidationLayer:
    def __init__(
        self,
        validators: dict[str, Callable[[Any], ValidationResult]] | None = None,
    ) -> None:
        self._validators = dict(validators or {})

    def register(self, operation: str, validator: Callable[[Any], ValidationResult]) -> None:
        self._validators[operation] = validator

    def validate_input(self, operation: str, input_data: Any) -> ValidationResult:
        if operation in self._validators:
            return self._validators[operation](input_data)
        if input_data is None:
            return ValidationResult(valid=False, issues=[ValidationIssue(message="input is null", code="NULL_INPUT")])
        return ValidationResult(valid=True)

    def validate_contract(self, operation: str, payload: Any) -> ValidationResult:
        return self.validate_input(operation, payload)
