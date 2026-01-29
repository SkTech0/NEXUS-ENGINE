"""
Model registry — register and lookup models by id, version, tags.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class RegistryEntry:
    """Registry entry: model_id, version, tags, metadata."""

    model_id: str
    version: str
    tags: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


class ModelRegistry:
    """
    Registry: register, get, list by id or tag.
    Testable.
    """

    def __init__(self) -> None:
        self._by_id: dict[str, list[RegistryEntry]] = {}
        self._by_tag: dict[str, list[RegistryEntry]] = {}

    def register(self, entry: RegistryEntry) -> None:
        """Register entry. Testable."""
        self._by_id.setdefault(entry.model_id, []).append(entry)
        for tag in entry.tags:
            self._by_tag.setdefault(tag, []).append(entry)

    def get(self, model_id: str, version: str | None = None) -> RegistryEntry | None:
        """Get entry; if version None, latest. Testable."""
        entries = self._by_id.get(model_id, [])
        if not entries:
            return None
        if version is not None:
            for e in entries:
                if e.version == version:
                    return e
            return None
        return max(entries, key=lambda e: e.version)

    def list_models(self) -> list[str]:
        """All model ids. Testable."""
        return list(self._by_id.keys())

    def list_by_tag(self, tag: str) -> list[RegistryEntry]:
        """Entries with tag. Testable."""
        return list(self._by_tag.get(tag, []))


def create_model_registry() -> ModelRegistry:
    """Create model registry. Testable."""
    return ModelRegistry()
