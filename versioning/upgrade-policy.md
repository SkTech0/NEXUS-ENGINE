## Upgrade policy

This document defines how upgrades are executed safely across environments.

### Goals

- Predictable upgrades with minimal risk.
- Clear rollback and mitigation strategies.
- Governance alignment between engineering, security, and operations.

### Upgrade classes

- **Patch upgrade**: bug/security fixes only; low risk; fast rollout.
- **Minor upgrade**: additive features; moderate risk; staged rollout with canary.
- **Major upgrade**: breaking changes; high risk; requires explicit migration plan.

### Promotion flow

All upgrades follow:

`dev → qa → staging → prod`

with explicit gates and signoffs at each promotion boundary (see `release/change-management.md`).

### Backward compatibility requirements

- Within the same MAJOR:
  - upgrades must preserve API compatibility
  - data migrations must be backward-readable
- For major upgrades:
  - provide a version negotiation strategy
  - provide a migration plan with a rollback story

### Required validation for production promotion

- automated test suite + smoke checks
- canary metrics within thresholds
- migration readiness (if applicable)
- rollback plan validated (dry-run or rehearsed)

