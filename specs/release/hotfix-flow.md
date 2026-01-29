## Hotfix flow

Hotfixes are urgent production fixes that must minimize time-to-recover while preserving governance.

### When to use hotfix

- Active incident impacting availability, correctness, security, or compliance.
- Rollback is not sufficient or not possible.

### Flow

1. **Declare incident**
   - create incident ticket
   - assign incident commander and approvers
2. **Branching**
   - create hotfix branch from last-known-good release tag
3. **Implement fix**
   - smallest possible change set
   - include tests or validation steps
4. **Build + validate**
   - run required gates per risk class
5. **Deploy**
   - prefer canary hotfix in prod if possible
   - otherwise blue/green with fast switch
6. **Verify**
   - confirm metrics recovery and customer impact reduction
7. **Post-incident**
   - backport hotfix to mainline
   - retrospective and preventative actions

### Governance

- Hotfix approvals are expedited but not skipped.
- Every hotfix requires:
  - change record
  - rollback plan
  - metrics snapshot before/after

