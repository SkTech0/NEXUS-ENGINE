## Migration flow (gated)

This flow governs schema/data migrations that accompany releases.

### Principles

- Migrations must be **rehearsed** in staging.
- Prefer **expand/contract** and **backward-readable** changes.
- Every migration requires a **rollback plan** (or compensating strategy).

### Flow

1. **Design**
   - migration plan with steps, expected duration, and rollback
   - compatibility analysis (see `versioning/schema-versioning.md`)
2. **Risk classification**
   - classify change (low/medium/high) per `change-management.md`
3. **Preflight**
   - validate backups/restore procedures
   - validate capacity and lock impact
4. **Staging rehearsal**
   - run migration in staging with production-like data shape
   - measure duration, errors, and performance impact
5. **Production execution**
   - execute during approved window
   - monitor health gates throughout
6. **Post-migration validation**
   - verify data integrity checks
   - verify API/engine health and performance
7. **Contract step (optional)**
   - remove deprecated fields only after deprecation window

### Gating checklist

- [ ] Migration reviewed and approved
- [ ] Backups verified
- [ ] Rollback plan validated
- [ ] Staging rehearsal successful
- [ ] Canary plan (if applicable) defined

