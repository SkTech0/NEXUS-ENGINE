"""
Base schemas — field definitions and validation helpers.
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable


@dataclass
class FieldSchema:
    """Field definition: name, type, optional validator."""

    name: str
    dtype: str = "any"
    required: bool = True
    validator: Callable[[Any], bool] | None = None

    def validate(self, value: Any) -> bool:
        """Validate value. Testable."""
        if value is None or (isinstance(value, str) and value == ""):
            return not self.required
        if self.validator is not None:
            return self.validator(value)
        return True


@dataclass
class DocumentSchema:
    """Schema for a document: list of fields."""

    name: str
    fields: list[FieldSchema]

    def validate(self, data: dict[str, Any]) -> tuple[bool, list[str]]:
        """
        Validate data against schema. Returns (valid, list of error messages).
        Testable.
        """
        errors: list[str] = []
        for f in self.fields:
            val = data.get(f.name)
            if val is None and f.required:
                errors.append(f"Missing required field: {f.name}")
            elif val is not None and not f.validate(val):
                errors.append(f"Invalid value for field: {f.name}")
        return (len(errors) == 0, errors)


def required_string(value: Any) -> bool:
    """Validator: non-empty string. Testable."""
    return isinstance(value, str) and len(value.strip()) > 0


def optional_int(value: Any) -> bool:
    """Validator: int or None. Testable."""
    return value is None or isinstance(value, int)
