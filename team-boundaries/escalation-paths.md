# Escalation Paths

Escalation for decoupled NEXUS-ENGINE services and platform.

## By Area

| Area | First Line | Escalation |
|------|------------|------------|
| engine-core logic | Core Engine | Platform Architect |
| engine-api logic | API / Backend | Platform Architect |
| engine-ai logic | AI/ML | Platform Architect |
| engine-data logic | Data | Platform Architect |
| engine-intelligence logic | Intelligence | Platform Architect |
| engine-optimization logic | Optimization | Platform Architect |
| engine-trust logic | Trust / Security | Platform Architect |
| engine-distributed logic | Distributed Systems | Platform Architect |
| product-ui logic | Frontend / UI | Platform Architect |
| Service shells, runners, config, health, lifecycle, adapters | Platform / Runtime | SRE / Platform Lead |
| Gateway (routes, discovery, registry) | Platform / Runtime | SRE / Platform Lead |
| Orchestration (registry, discovery, dependency-map, lifecycle) | Platform / Runtime | SRE / Platform Lead |
| Deployment (Docker, Compose, K8s) | Platform / SRE | Platform Lead |
| Incidents (outage, degradation) | On-call / SRE | Incident Commander, Platform Lead |

## By Symptom

- **Service not starting** → Owning team (logic) or Platform / Runtime (shell, config).
- **Wrong response / bug in feature** → Owning team for that service.
- **Gateway/orchestration/deployment misconfiguration** → Platform / Runtime or SRE.
- **Cross-service contract break** → Owning teams of producer and consumer; Platform mediates if needed.
- **Security/trust issue** → Trust / Security team and Platform / Security.

## Contact Conventions

- Document actual contacts in a separate runbook or wiki; this file defines **paths** only.
- Prefer Slack/Teams channels per team and a shared #nexus-engine or #platform channel for cross-team and platform.
