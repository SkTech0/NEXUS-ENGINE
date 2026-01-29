## Data versioning

This document defines how persisted data evolves safely across releases.

### Goals

- Preserve read compatibility across upgrades.
- Enable safe migrations with rollback plans.
- Avoid data loss and incompatible writes.

### Strategies

- **Expand / contract (recommended)**:
  - Expand: add new columns/fields (nullable or with defaults)
  - Backfill: populate new fields
  - Contract: remove old columns/fields only after deprecation window
- **Dual-write / dual-read**:
  - Write both old and new shapes during transition
  - Read preferentially from new, fallback to old

### Compatibility guarantees

- Within the same engine **MAJOR**, the system should:
  - read data written by previous MINOR/PATCH versions
  - avoid writing data in a way that breaks older readers unless explicitly gated

### Migration gating

All migrations must be:

- reviewed and approved (risk-classified)
- executed first in staging
- guarded by rollout gates
- accompanied by rollback/restore procedures

See `release/migration-flow.md` for the operational flow scaffold.

