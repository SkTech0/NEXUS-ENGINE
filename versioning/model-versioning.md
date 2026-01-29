## Model versioning

This document defines versioning for AI/ML models used by Nexus Engine.

### Goals

- Reproducible inference behavior per environment and release.
- Safe rollout/rollback across model changes.
- Clear compatibility between models, schemas, and API contracts.

### Model identity

A model must be uniquely identified by:

- **modelId**: stable name (e.g. `default`, `trust-classifier`)
- **modelVersion**: SemVer-like or provider-native version (recommended SemVer)
- **artifact hash**: immutable content hash when applicable (registry artifact digest)

Example:

- `modelId=default`
- `modelVersion=2.3.1`
- `artifactDigest=sha256:<...>`

### Versioning scheme

Recommended SemVer mapping:

- **MAJOR**: breaking output contract changes (shape, meaning), incompatible tokenization changes, incompatible safety policies.
- **MINOR**: additive outputs, improved performance/accuracy, compatible safety enhancements.
- **PATCH**: bug fixes, minor tuning, no contract changes.

### Compatibility guarantees

Model changes must be validated against:

- input schema compatibility (see `schema-versioning.md`)
- output schema compatibility (consumer compatibility)
- operational constraints (latency/cost/SLO)

### Rollout strategy (aligned to release system)

- Validate in `dev` → `qa` → `staging`
- Promote via:
  - canary (subset of traffic)
  - then gradual ramp
- Rollback capability:
  - keep previous model artifacts available
  - allow quick switch via config pointer

### Version negotiation

If clients request a model version:

- prefer highest compatible version in the requested MAJOR line
- reject if incompatible (with clear error and supported versions)

