"""
Feature extractor — extract features from raw inputs.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Callable

from errors.error_model import ExecutionError, ValidationError

_logger = logging.getLogger("engine-ai")


@dataclass
class FeatureSpec:
    """Spec for a feature: name and dtype."""

    name: str
    dtype: str = "float"


class FeatureExtractor:
    """
    Feature extractor: set extract fn and optional schema; extract(input) -> features.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._extract_fn: Callable[[Any], dict[str, Any]] | None = None
        self._specs: list[FeatureSpec] = []

    def set_extractor(self, fn: Callable[[Any], dict[str, Any]]) -> None:
        """Set (raw_input) -> features dict. Validates fn non-null."""
        if fn is None:
            raise ValidationError("extractor fn is required", details={"field": "fn"})
        self._extract_fn = fn

    def add_spec(self, spec: FeatureSpec) -> None:
        """Add feature spec. Validates spec and name before mutation."""
        if spec is None:
            raise ValidationError("spec is required", details={"field": "spec"})
        if not (getattr(spec, "name", None) or "").strip():
            raise ValidationError("spec name is required", details={"field": "name"})
        self._specs.append(spec)
        _logger.debug("feature_extractor.add_spec name=%s", spec.name)

    def extract(self, raw: Any) -> dict[str, Any]:
        """Extract features from raw input. Validates before execution; logs on error."""
        if self._extract_fn is None:
            _logger.debug("feature_extractor.extract no extractor set")
            return {}
        try:
            out = self._extract_fn(raw)
            _logger.debug("feature_extractor.extract keys=%s", len(out) if isinstance(out, dict) else 0)
            return out if isinstance(out, dict) else {}
        except ValidationError:
            raise
        except Exception as e:
            _logger.error("feature_extractor.extract error=%s", e, exc_info=True)
            raise ExecutionError(str(e), cause=type(e).__name__, retryable=True) from e

    def specs(self) -> list[FeatureSpec]:
        """Feature specs."""
        return list(self._specs)


def create_feature_extractor() -> FeatureExtractor:
    """Create feature extractor. Testable."""
    return FeatureExtractor()
