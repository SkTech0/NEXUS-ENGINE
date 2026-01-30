"""
Model registry — register and lookup models by id, version, tags.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-ai")


@dataclass
class RegistryEntry:
    """Registry entry: model_id, version, tags, metadata."""

    model_id: str
    version: str
    tags: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


def _validate_entry(entry: RegistryEntry) -> None:
    if entry is None:
        raise ValidationError("entry is required", details={"field": "entry"})
    if not (getattr(entry, "model_id", None) or "").strip():
        raise ValidationError("model_id is required", details={"field": "model_id"})
    if not (getattr(entry, "version", None) or "").strip():
        raise ValidationError("version is required", details={"field": "version"})


class ModelRegistry:
    """
    Registry: register, get, list by id or tag.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._by_id: dict[str, list[RegistryEntry]] = {}
        self._by_tag: dict[str, list[RegistryEntry]] = {}

    def register(self, entry: RegistryEntry) -> None:
        """Register entry. Validates before state mutation."""
        _validate_entry(entry)
        self._by_id.setdefault(entry.model_id, []).append(entry)
        for tag in entry.tags:
            self._by_tag.setdefault(tag, []).append(entry)
        _logger.info("registry.register model_id=%s version=%s", entry.model_id, entry.version)

    def get(self, model_id: str, version: str | None = None) -> RegistryEntry | None:
        """Get entry; if version None, latest. Validates model_id."""
        if not (model_id or "").strip():
            raise ValidationError("model_id is required", details={"field": "model_id"})
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
        """All model ids."""
        return list(self._by_id.keys())

    def list_by_tag(self, tag: str) -> list[RegistryEntry]:
        """Entries with tag. Validates tag non-empty."""
        if not (tag or "").strip():
            raise ValidationError("tag is required", details={"field": "tag"})
        return list(self._by_tag.get(tag, []))


def create_model_registry() -> ModelRegistry:
    """Create model registry. Testable."""
    return ModelRegistry()
