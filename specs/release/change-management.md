## Change management

This document defines governance for changes promoted through `dev → qa → staging → prod`.

### Roles (recommended)

- **Change owner**: accountable engineer for the change
- **Approver(s)**: platform lead + security (as needed)
- **Release manager**: coordinates execution and comms
- **On-call/IC**: monitors and handles incidents during rollout

### Risk classification

#### Low risk

- Patch fixes
- Documentation-only changes
- Additive config changes (no behavior change)

Approvals: 1 approver; standard monitoring window.

#### Medium risk

- Additive features behind flags
- Additive schema changes
- Performance-impacting changes with mitigation plan

Approvals: platform + product/owner; canary required in prod.

#### High risk

- Migrations
- Major version change
- Auth/security posture changes
- Multi-service or distributed-impact changes

Approvals: platform + security + stakeholder; staging rehearsal required; blue/green or conservative canary.

### Required artifacts

- Change record (ticket/RFC)
- Risk classification
- Rollout plan (canary/blue-green)
- Rollback plan
- Validation plan + success metrics
- Communication plan (internal + external if required)

### Approval flow (default)

1. dev: automated gates
2. qa: strict gates + signoff
3. staging: prod-like rehearsal + signoff
4. prod: change approval + controlled rollout + monitoring

