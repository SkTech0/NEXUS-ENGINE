# Extension Ecosystem

## Purpose

Define the extension ecosystem for NEXUS-ENGINE: extensibility (extensions, hooks, or adapters) that allow customers or partners to extend or customize integration without forking the engine. Additive; no change to engine behavior or API contracts unless extension API is explicitly added as optional.

## Principles

- **Extension as product**: Extensions are first-class product concept; extension points (if implemented) are optional; engine core unchanged.
- **Governance**: Extension compatibility, versioning, and security are governed (governance/compatibility-policy); may overlap with plugin ecosystem (ecosystem/plugin-ecosystem).
- **No required engine change**: EPL defines extension ecosystem as product; implementation may be SDK wrappers, BFF, or engine extension point—no mandatory engine logic change.

## Extension Scope (Product)

| Aspect | Description |
|--------|-------------|
| **Extension points** | Hooks, callbacks, or adapters for custom logic; definition is product/architectural |
| **Extension contract** | Input/output, lifecycle, versioning; compatibility (governance/compatibility-policy) |
| **Distribution** | Extension package or marketplace (ecosystem/marketplace-ecosystem) |
| **Tier** | Extension availability per tier (tiers/; offerings/engine-as-a-platform) |
| **SDK** | Extensions may use SDK (ecosystem/sdk-ecosystem) to call engine |

## Relationship to Plugin and Connector

- **Plugin**: Often runtime extension (e.g., custom evaluator inside or alongside engine); extension may be broader (SDK-based, BFF-based).
- **Connector**: Integration with external system (ecosystem/connector-ecosystem); extension may include connector-like adapters.
- **Extension**: Umbrella for custom logic, adapters, and integrations; product boundary and naming are org-specific.
- No engine logic or API changes unless extension API is explicitly added; EPL is product definition only.

## Certification Readiness

- Extension ecosystem documented; extension points and distribution are org-specific.
- No engine regression.
