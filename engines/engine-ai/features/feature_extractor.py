"""
Feature extractor — extract features from raw inputs.
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable


@dataclass
class FeatureSpec:
    """Spec for a feature: name and dtype."""

    name: str
    dtype: str = "float"


class FeatureExtractor:
    """
    Feature extractor: set extract fn and optional schema; extract(input) -> features.
    Testable.
    """

    def __init__(self) -> None:
        self._extract_fn: Callable[[Any], dict[str, Any]] | None = None
        self._specs: list[FeatureSpec] = []

    def set_extractor(self, fn: Callable[[Any], dict[str, Any]]) -> None:
        """Set (raw_input) -> features dict. Testable."""
        self._extract_fn = fn

    def add_spec(self, spec: FeatureSpec) -> None:
        """Add feature spec. Testable."""
        self._specs.append(spec)

    def extract(self, raw: Any) -> dict[str, Any]:
        """Extract features from raw input. Testable."""
        if self._extract_fn is None:
            return {}
        return self._extract_fn(raw)

    def specs(self) -> list[FeatureSpec]:
        """Feature specs. Testable."""
        return list(self._specs)


def create_feature_extractor() -> FeatureExtractor:
    """Create feature extractor. Testable."""
    return FeatureExtractor()
