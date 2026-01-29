"""
Plugin engine — register, load, and run plugins.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable, Protocol


class Plugin(Protocol):
    """Plugin protocol: id, name, optional init and run."""

    @property
    def id(self) -> str: ...
    @property
    def name(self) -> str: ...

    def init(self, context: dict[str, Any]) -> None: ...
    def run(self, input_data: Any) -> Any: ...


@dataclass
class PluginDescriptor:
    """Plugin descriptor: id, name, version, metadata."""

    id: str
    name: str
    version: str = "1.0.0"
    metadata: dict[str, Any] = field(default_factory=dict)


class PluginEngine:
    """
    Plugin engine: register, get, list; optional loader.
    Testable.
    """

    def __init__(self) -> None:
        self._plugins: dict[str, Any] = {}
        self._descriptors: dict[str, PluginDescriptor] = {}

    def register(self, plugin: Any, descriptor: PluginDescriptor | None = None) -> None:
        """Register plugin; descriptor from plugin or explicit. Testable."""
        pid = getattr(plugin, "id", None) or (descriptor.id if descriptor else str(id(plugin)))
        self._plugins[pid] = plugin
        if descriptor:
            self._descriptors[pid] = descriptor
        else:
            self._descriptors[pid] = PluginDescriptor(
                id=pid,
                name=getattr(plugin, "name", pid),
                version=getattr(plugin, "version", "1.0.0"),
            )

    def get(self, plugin_id: str) -> Any | None:
        """Get plugin by id. Testable."""
        return self._plugins.get(plugin_id)

    def list_plugins(self) -> list[PluginDescriptor]:
        """List registered plugin descriptors. Testable."""
        return list(self._descriptors.values())

    def run(self, plugin_id: str, input_data: Any, context: dict[str, Any] | None = None) -> Any:
        """Init (if present) and run plugin. Testable."""
        plugin = self._plugins.get(plugin_id)
        if plugin is None:
            raise KeyError(f"Plugin not found: {plugin_id}")
        if hasattr(plugin, "init") and context is not None:
            plugin.init(context)
        if hasattr(plugin, "run"):
            return plugin.run(input_data)
        return None


def create_plugin_engine() -> PluginEngine:
    """Create plugin engine. Testable."""
    return PluginEngine()
