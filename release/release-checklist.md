## Release checklist (template)

### Pre-release

- [ ] Version chosen (SemVer) and documented
- [ ] Change log / release notes drafted
- [ ] Risk class assigned (low/medium/high)
- [ ] Compatibility review complete (`versioning/*`)
- [ ] Security review complete (as required)
- [ ] Migration plan approved (if applicable)

### Build & test

- [ ] Build succeeded
- [ ] Unit tests passed
- [ ] Integration/contract tests passed
- [ ] Static analysis and dependency scanning passed

### Deploy validation

- [ ] Deployed to dev and validated
- [ ] Promoted to qa with strict validation
- [ ] Promoted to staging and rehearsed (including migrations)
- [ ] Production deployment plan selected (canary or blue/green)

### Production rollout

- [ ] Approvals obtained per `change-management.md`
- [ ] Canary/blue-green started
- [ ] Metrics within thresholds (error rate, latency, saturation)
- [ ] Rollback ready and tested (where feasible)
- [ ] Rollout completed and observed for the required window

### Post-release

- [ ] Release notes published
- [ ] Incidents/alerts reviewed
- [ ] KPIs captured (deployment lead time, MTTR, rollback rate)
- [ ] Follow-ups created for any regressions or debt

