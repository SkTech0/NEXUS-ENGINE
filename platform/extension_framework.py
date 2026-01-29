"""
Extension framework — load, lifecycle, and dispatch extensions.
Modular, testable.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable


class ExtensionPhase(Enum):
    LOAD = "load"
    ENABLE = "enable"
    DISABLE = "disable"
    UNLOAD = "unload"


@dataclass
class Extension:
    """Extension: id, name, version, hooks per phase."""

    id: str
    name: str
    version: str = "1.0.0"
    hooks: dict[ExtensionPhase, Callable[[dict[str, Any]], None]] = field(default_factory=dict)


@dataclass
class ExtensionState:
    """Extension state: loaded, enabled."""

    extension_id: str
    loaded: bool = False
    enabled: bool = False


class ExtensionFramework:
    """
    Extension framework: register, load, enable, disable, run hook.
    Testable.
    """

    def __init__(self) -> None:
        self._extensions: dict[str, Extension] = {}
        self._state: dict[str, ExtensionState] = {}

    def register(self, extension: Extension) -> None:
        """Register extension. Testable."""
        self._extensions[extension.id] = extension
        self._state[extension.id] = ExtensionState(extension_id=extension.id)

    def get(self, extension_id: str) -> Extension | None:
        """Get extension by id. Testable."""
        return self._extensions.get(extension_id)

    def load(self, extension_id: str, context: dict[str, Any] | None = None) -> bool:
        """Run load hook; mark loaded. Testable."""
        ext = self._extensions.get(extension_id)
        if ext is None:
            return False
        hook = ext.hooks.get(ExtensionPhase.LOAD)
        if hook is not None:
            hook(context or {})
        self._state[extension_id].loaded = True
        return True

    def enable(self, extension_id: str, context: dict[str, Any] | None = None) -> bool:
        """Run enable hook; mark enabled. Testable."""
        ext = self._extensions.get(extension_id)
        if ext is None or not self._state.get(extension_id, ExtensionState(extension_id)).loaded:
            return False
        hook = ext.hooks.get(ExtensionPhase.ENABLE)
        if hook is not None:
            hook(context or {})
        self._state[extension_id].enabled = True
        return True

    def disable(self, extension_id: str, context: dict[str, Any] | None = None) -> bool:
        """Run disable hook; mark disabled. Testable."""
        ext = self._extensions.get(extension_id)
        if ext is None:
            return False
        hook = ext.hooks.get(ExtensionPhase.DISABLE)
        if hook is not None:
            hook(context or {})
        self._state[extension_id].enabled = False
        return True

    def get_state(self, extension_id: str) -> ExtensionState | None:
        """Get extension state. Testable."""
        return self._state.get(extension_id)

    def list_extensions(self) -> list[Extension]:
        """List registered extensions. Testable."""
        return list(self._extensions.values())


def create_extension_framework() -> ExtensionFramework:
    """Create extension framework. Testable."""
    return ExtensionFramework()
