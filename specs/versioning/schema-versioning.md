## Schema versioning

This document governs versioning for schemas used across APIs, data, and model I/O.

### Scope

- API request/response payload schemas
- internal message/event schemas (if/when used)
- model input/output schemas
- persisted storage schemas

### Versioning scheme

Schemas should use SemVer where:

- **MAJOR**: breaking schema change (removal, type change, incompatible constraints)
- **MINOR**: additive schema change (new optional fields)
- **PATCH**: clarifications, documentation, non-functional constraints that do not break clients

### Compatibility rules (strong defaults)

- **Additive-only** changes are preferred:
  - add optional fields
  - add enum values only if clients treat unknown values safely
- **Never**:
  - change meaning of existing fields without a major version bump
  - change required/optional status without a major bump (or dual-write/read strategy)

### Backward vs forward compatibility

- **Backward compatible**: new readers can read old data.
- **Forward compatible**: old readers can read new data.

Preferred approach:

- Maintain backward compatibility always.
- Achieve forward compatibility via:
  - unknown-field tolerance
  - default values
  - feature negotiation

### Migration posture

When a breaking change is unavoidable:

- introduce a new schema version
- support dual-read/dual-write during overlap
- migrate data with gating (see `release/migration-flow.md`)
- remove old version only per `deprecation-policy.md`

