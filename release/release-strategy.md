## Release strategy

This document defines the release engineering model for Nexus Engine.

### Goals

- Safe, repeatable promotions: `dev → qa → staging → prod`
- Measurable release health (SLO/SLA, error budgets, performance)
- Rapid rollback with minimal blast radius
- Governed change management and risk classification

### Release models supported

#### Canary releases (default for prod)

- Deploy a new version to a **small subset** of traffic/users.
- Monitor metrics and health gates.
- Gradually increase traffic until full rollout.
- Automatically rollback on regressions (see `rollback.yml`).

#### Blue/green deployments (for higher-risk changes)

- Maintain **two full environments**:
  - Blue = currently serving production
  - Green = new candidate
- Validate green under production-like load.
- Switch traffic atomically (DNS/ingress/route flip).
- Keep blue for fast rollback.

### Promotion flow

- **dev**: continuous integration builds, basic validations, feature toggles.
- **qa**: strict validation, integration tests, compatibility checks.
- **staging**: prod-like, performance + migration rehearsal, release candidate signoff.
- **prod**: canary/blue-green, governance approvals, metrics monitoring, rollback ready.

### Risk classification

Changes are classified per `change-management.md`:

- Low (patch, config-only, no migration)
- Medium (minor features, additive schema)
- High (migrations, major changes, multi-service impact)

### Release validation gates (minimum)

- Build + unit/integration tests
- Security scanning (SAST/dep)
- Contract tests / schema compatibility checks
- Migration readiness (if applicable)
- Canary metrics within thresholds

### Release metrics

- Availability and error rate
- p50/p95/p99 latency
- Resource utilization saturation
- Deployment duration and success rate
- Rollback rate and mean time to recover (MTTR)

