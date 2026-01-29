## Patch flow

Patches are low-risk, backwards-compatible fixes (bug/security) released as \(x.y.Z\).

### Characteristics

- No breaking changes
- No behavior changes that require opt-in
- No non-backward-compatible migrations

### Flow

1. Create patch branch from current stable line
2. Implement fix + tests
3. Run CI gates
4. Promote through `dev → qa → staging → prod`
5. Deploy using **canary** by default
6. Monitor and finalize release notes

### Rollback

Patch rollbacks should be straightforward:

- revert to previous patch artifact
- validate recovery
- record metrics and root cause

