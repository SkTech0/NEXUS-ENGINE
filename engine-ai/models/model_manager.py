"""
Model manager — load, save, and manage model artifacts.
Enterprise: validation, logging, clear errors (ERL-4).
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-ai")


@dataclass
class ModelArtifact:
    """A model artifact: id, version, metadata, optional payload."""

    id: str
    version: str
    metadata: dict[str, Any] = field(default_factory=dict)
    payload: Any = None


def _validate_artifact(artifact: ModelArtifact) -> None:
    if not (artifact.id or "").strip():
        raise ValidationError("model artifact id is required", details={"field": "id"})
    if not (artifact.version or "").strip():
        raise ValidationError("model artifact version is required", details={"field": "version"})


def _validate_model_version(model_id: str, version: str) -> None:
    if not (model_id or "").strip():
        raise ValidationError("model_id is required", details={"field": "model_id"})
    if not (version or "").strip():
        raise ValidationError("version is required", details={"field": "version"})


class ModelManager:
    """
    Model manager: register load/save; get, put, list models.
    Enterprise: input validation, structured logging, safe errors.
    """

    def __init__(self) -> None:
        self._models: dict[str, dict[str, ModelArtifact]] = {}
        self._load_fn: Callable[[str, str], Any] | None = None
        self._save_fn: Callable[[str, str, Any], None] | None = None

    def set_load(self, fn: Callable[[str, str], Any]) -> None:
        """Set loader (model_id, version) -> payload. Testable."""
        self._load_fn = fn

    def set_save(self, fn: Callable[[str, str, Any], None]) -> None:
        """Set saver (model_id, version, payload). Testable."""
        self._save_fn = fn

    def put(self, artifact: ModelArtifact) -> None:
        """Register artifact. Validates id/version; optionally call save_fn."""
        _validate_artifact(artifact)
        self._models.setdefault(artifact.id, {})[artifact.version] = artifact
        if self._save_fn and artifact.payload is not None:
            try:
                self._save_fn(artifact.id, artifact.version, artifact.payload)
            except Exception as e:
                _logger.error("model_manager.put save_fn failed: %s", e, exc_info=True)
                raise
        _logger.info("model_manager.put model_id=%s version=%s", artifact.id, artifact.version)

    def get(self, model_id: str, version: str | None = None) -> ModelArtifact | None:
        """Get artifact; if version None, latest. Returns None if not found."""
        if not (model_id or "").strip():
            raise ValidationError("model_id is required", details={"field": "model_id"})
        if model_id not in self._models:
            return None
        versions = self._models[model_id]
        if version is not None:
            return versions.get(version)
        if not versions:
            return None
        return max(versions.values(), key=lambda a: a.version)

    def list_models(self) -> list[str]:
        """All model ids. Testable."""
        return list(self._models.keys())

    def list_versions(self, model_id: str) -> list[str]:
        """All versions for model. Testable."""
        if not (model_id or "").strip():
            raise ValidationError("model_id is required", details={"field": "model_id"})
        return list(self._models.get(model_id, {}).keys())

    def load_payload(self, model_id: str, version: str) -> Any | None:
        """Load payload via load_fn if set; else from artifact. Validates inputs."""
        _validate_model_version(model_id, version)
        artifact = self.get(model_id, version)
        if artifact is None:
            return None
        if self._load_fn is not None:
            return self._load_fn(model_id, version)
        return artifact.payload


def create_model_manager() -> ModelManager:
    """Create model manager. Enterprise-ready."""
    return ModelManager()
