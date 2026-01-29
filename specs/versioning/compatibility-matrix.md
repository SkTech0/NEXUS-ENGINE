## Compatibility matrix (template)

This matrix defines which combinations are supported:

- Engine version
- API major version
- Model version line
- Schema version line
- Data migration level

> This is a governance template; populate with real values per release line.

### Matrix

| Engine (SemVer) | API Major | Model line | Schema line | Data level | Support level | Notes |
|---|---:|---|---|---|---|---|
| 1.x | v1 | 1.x | 1.x | L1 | Stable | Default stable line |
| 1.x (LTS) | v1 | 1.x | 1.x | L1/L2 | LTS | Extended support window |
| 2.x | v2 | 2.x | 2.x | L2 | Stable | Next major line |

### Compatibility guarantees

- **Within same Engine MAJOR**:
  - API MAJOR remains stable (e.g., Engine 1.x supports API v1)
  - Schema changes are additive-only unless gated
- **Across Engine MAJOR**:
  - Compatibility must be explicitly declared
  - Upgrade requires `upgrade-policy.md` compliance

### Negotiation rules (default)

When multiple versions are available:

- Select the **highest mutually supported** version.
- If no mutual version exists:
  - fail fast with a clear error
  - include supported versions list and upgrade path link

