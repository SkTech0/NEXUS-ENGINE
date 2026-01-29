# NEXUS-ENGINE Ownership Map

Independent ownership boundaries for decoupled services. No modification to engine code; ownership is at process/deployment boundary.

## Service → Team Mapping

| Service | Owning Team | Repo Path (logic) | Shell / Deployment |
|---------|-------------|-------------------|--------------------|
| engine-core | Core Engine | engine-core/ | service-shells/engine-core-service, deployment-shells |
| engine-api | API / Backend | engine-api/ | service-shells/engine-api-service, deployment-shells |
| engine-ai | AI/ML | engine-ai/ | service-shells/engine-ai-service, deployment-shells |
| engine-data | Data | engine-data/ | service-shells/engine-data-service, deployment-shells |
| engine-intelligence | Intelligence | engine-intelligence/ | service-shells/engine-intelligence-service, deployment-shells |
| engine-optimization | Optimization | engine-optimization/ | service-shells/engine-optimization-service, deployment-shells |
| engine-trust | Trust / Security | engine-trust/ | service-shells/engine-trust-service, deployment-shells |
| engine-distributed | Distributed Systems | engine-distributed/ | service-shells/engine-distributed-service, deployment-shells |
| product-ui | Frontend / UI | product-ui/ | service-shells/product-ui-service, deployment-shells |

## Platform-Owned (Shared)

- **service-shells/** — Platform / Runtime team (wrappers, runners, config, health, lifecycle, adapters).
- **gateway-layer/** — Platform / Runtime team.
- **orchestration-layer/** — Platform / Runtime team.
- **deployment-shells/** — Platform / SRE (Docker, Compose, K8s definitions).

## Ownership Rules

1. Each team owns **only** the logic inside its repo path (e.g. engine-api owns engine-api/* code).
2. Service shells, gateway, orchestration, and deployment shells are **platform-owned**; teams do not modify them for feature work.
3. Config and env for each service are owned by the team that owns the service logic; platform provides defaults and structure.
4. CI/CD can be per-service; each team may have its own pipeline for its service image/deployment.
