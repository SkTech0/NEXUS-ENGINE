# Platform Layer

Plugins, integrations, marketplace, API registry, and extension framework.

## Files

| File | Purpose |
|------|--------|
| **plugin_engine.py** | PluginEngine — register, get, list_plugins, run(plugin_id, input_data) |
| **integration_engine.py** | IntegrationEngine — register, get, invoke(integration_id, payload) |
| **marketplace_engine.py** | MarketplaceEngine — add_offering, list_offerings, install, uninstall |
| **api_registry.py** | ApiRegistry — register, get, get_by_path, list_endpoints |
| **extension_framework.py** | ExtensionFramework — register, load, enable, disable, hooks by phase |

## Usage

From repo root with `PYTHONPATH=platform`:

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=platform
python -c "from platform import create_plugin_engine; e = create_plugin_engine(); print(e.list_plugins())"
```
