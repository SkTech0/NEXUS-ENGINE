# Platform Layer (Phase 12 — Ecosystem)

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

From repo root with `PYTHONPATH=.` (use a path that includes the parent of the `platform` folder so the package name does not shadow stdlib):

```bash
cd NEXUS-ENGINE
set PYTHONPATH=.
python -c "from platform import create_plugin_engine; e = create_plugin_engine(); print(e.list_plugins())"
```
