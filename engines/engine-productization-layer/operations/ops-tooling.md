# Operations Tooling

## Purpose

Define operations tooling for NEXUS-ENGINE: tooling used by the provider to operate the engine (monitoring, alerting, deployment, support, customer success). Additive; no change to engine behavior or APIs.

## Principles

- **Provider-side**: Tooling is for provider ops, not customer-facing engine features; engine code and API unchanged.
- **Observability alignment**: Engine may expose metrics, logs, traces (engine-observability); ops tooling consumes and acts on them; no engine logic change.
- **Operational only**: Tooling is process and platform; EPL defines product scope of ops, not implementation.

## Ops Tooling Scope

| Area | Description |
|------|-------------|
| **Monitoring** | Metrics, logs, traces; dashboards and alerting (engine-observability) |
| **Deployment** | CI/CD, release, rollback; deployment bundles (packaging/deployment-bundles) |
| **Support** | Ticket system, knowledge base, status page (operations/support-tiers) |
| **SLA** | Uptime and performance measurement; reporting (operations/sla-tiers) |
| **Customer success** | Health dashboards, usage reports (operations/customer-success) |
| **License / entitlement** | License validation, entitlement checks (commercial/license-validation, entitlements) |
| **Metering** | Usage collection for billing (commercial/metering, usage-tracking) |

## Engine Alignment

- Engine observability (engine-observability) and health (health/) feed into ops tooling; EPL does not change engine instrumentation.
- No engine logic or API changes; ops tooling is operations only.

## Certification Readiness

- Ops tooling scope documented; implementation is org-specific.
- No engine regression.
