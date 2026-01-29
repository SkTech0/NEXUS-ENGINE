## Engine versioning

This document defines how the **Nexus Engine** version is assigned, communicated, and governed.

### Versioning scheme (SemVer)

The engine uses **Semantic Versioning**: \(MAJOR.MINOR.PATCH\)

- **MAJOR**: breaking behavior/contract changes, removal of deprecated features, non-backwards compatible schema changes.
- **MINOR**: backwards-compatible features, opt-in capabilities, additive config/schema fields.
- **PATCH**: backwards-compatible bug/security fixes only.

### What constitutes a breaking change

- Any change that:
  - breaks existing API contracts,
  - changes default behavior without opt-in,
  - requires data migration without backward read compatibility,
  - removes a previously supported feature/config without deprecation.

### Build metadata

Optional metadata MAY be appended for build identity:

- `1.4.2+build.20260129.sha.<shortsha>`

Build metadata must not affect compatibility comparisons.

### Release channels

- **Stable**: default for production use.
- **LTS (Long-Term Support)**: selected stable minor line maintained longer.
- **Pre-release** (optional): `-alpha.N`, `-beta.N`, `-rc.N` for staging/canary validation.

### Compatibility guarantees

- Within the same **MAJOR**, the engine will preserve backwards compatibility for:
  - public API contracts (see `api-versioning.md`)
  - persisted schema reads (see `schema-versioning.md`)
  - data reads in storage where feasible (see `data-versioning.md`)

### Version negotiation model

When multiple components interact (API ↔ engine ↔ model ↔ data):

- Negotiate **highest mutually supported** version based on:
  - client-supported versions
  - server-supported versions
  - compatibility matrix constraints

See `compatibility-matrix.md` for the governance reminder and constraints template.

