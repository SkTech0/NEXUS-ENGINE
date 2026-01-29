"""
Platform layer — plugins, integrations, marketplace, API registry, extensions.
"""
from .plugin_engine import (
    PluginDescriptor,
    PluginEngine,
    create_plugin_engine,
)
from .integration_engine import (
    Integration,
    IntegrationConfig,
    IntegrationEngine,
    create_integration_engine,
)
from .marketplace_engine import (
    InstalledOffering,
    MarketplaceEngine,
    Offering,
    create_marketplace_engine,
)
from .api_registry import (
    ApiEndpoint,
    ApiRegistry,
    create_api_registry,
)
from .extension_framework import (
    Extension,
    ExtensionFramework,
    ExtensionPhase,
    ExtensionState,
    create_extension_framework,
)

__all__ = [
    "PluginDescriptor",
    "PluginEngine",
    "create_plugin_engine",
    "Integration",
    "IntegrationConfig",
    "IntegrationEngine",
    "create_integration_engine",
    "Offering",
    "InstalledOffering",
    "MarketplaceEngine",
    "create_marketplace_engine",
    "ApiEndpoint",
    "ApiRegistry",
    "create_api_registry",
    "Extension",
    "ExtensionPhase",
    "ExtensionState",
    "ExtensionFramework",
    "create_extension_framework",
]
