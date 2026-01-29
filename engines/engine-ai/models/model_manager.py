"""
Model manager — load, save, and manage model artifacts.
Modular, testable; abstract over backends.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class ModelArtifact:
    """A model artifact: id, version, metadata, optional payload."""

    id: str
    version: str
    metadata: dict[str, Any] = field(default_factory=dict)
    payload: Any = None


class ModelManager:
    """
    Model manager: register load/save; get, put, list models.
    Testable with in-memory store.
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
        """Register artifact. Optionally call save_fn. Testable."""
        self._models.setdefault(artifact.id, {})[artifact.version] = artifact
        if self._save_fn and artifact.payload is not None:
            self._save_fn(artifact.id, artifact.version, artifact.payload)

    def get(self, model_id: str, version: str | None = None) -> ModelArtifact | None:
        """Get artifact; if version None, latest. Testable."""
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
        return list(self._models.get(model_id, {}).keys())

    def load_payload(self, model_id: str, version: str) -> Any | None:
        """Load payload via load_fn if set; else from artifact. Testable."""
        artifact = self.get(model_id, version)
        if artifact is None:
            return None
        if self._load_fn is not None:
            return self._load_fn(model_id, version)
        return artifact.payload


def create_model_manager() -> ModelManager:
    """Create model manager. Testable."""
    return ModelManager()
