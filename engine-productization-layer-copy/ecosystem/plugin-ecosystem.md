# Plugin Ecosystem

## Purpose

Define the plugin ecosystem for NEXUS-ENGINE: extensibility points that allow third-party or internal plugins to extend engine behavior (e.g., custom evaluators, connectors, hooks) without modifying engine core. Additive; no change to engine behavior or API contracts unless plugin API is explicitly added as optional extension.

## Principles

- **Pluggable extension**: Plugin API (if present) is an optional extension layer; engine core remains unchanged; plugins run in defined sandbox or lifecycle (org-specific implementation).
- **Governance**: Plugin certification, compatibility, and security are governed (governance/compatibility-policy); marketplace may list certified plugins (ecosystem/marketplace-ecosystem).
- **No required engine change**: EPL defines plugin ecosystem as product concept; implementation may be adapter layer, sidecar, or engine extension point—no mandatory engine logic change.

## Plugin Scope (Product)

| Aspect | Description |
|--------|-------------|
| **Extension points** | Hooks or interfaces for custom logic (e.g., pre/post decision, custom evaluator); definition is product/architectural |
| **Plugin contract** | Input/output, lifecycle, versioning; compatibility policy (governance/compatibility-policy) |
| **Certification** | Certified vs community plugins; security and compatibility review (org-specific) |
| **Distribution** | Plugin package or marketplace listing (ecosystem/marketplace-ecosystem) |
| **Tier** | Plugin availability per tier (e.g., Professional+ for certified plugins) (tiers/) |

## Platform Alignment

- Plugin ecosystem supports engine-as-a-platform (offerings/engine-as-a-platform); extension ecosystem (ecosystem/extension-ecosystem) may overlap or specialize.
- No engine logic or API changes unless plugin API is explicitly added as optional extension; EPL is product definition only.

## Certification Readiness

- Plugin ecosystem documented; extension points and certification are org-specific.
- No engine regression.
