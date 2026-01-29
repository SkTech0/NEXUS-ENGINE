# Domain Ownership

Domain boundaries for NEXUS-ENGINE decoupled services. Aligned with service ownership.

## Domains

| Domain | Owner | Services | Description |
|--------|-------|----------|-------------|
| Core | Core Engine | engine-core | Engine kernel, entities, contracts, ports. |
| API | API / Backend | engine-api | HTTP API, controllers, loan domain, integration with other engines. |
| AI | AI/ML | engine-ai | Inference, models, training, pipelines. |
| Data | Data | engine-data | Repositories, storage, data access. |
| Intelligence | Intelligence | engine-intelligence | Evaluation, context, intelligence logic. |
| Optimization | Optimization | engine-optimization | Optimization objectives, constraints, results. |
| Trust | Trust / Security | engine-trust | Verification, audit, identity, reputation, security. |
| Distributed | Distributed Systems | engine-distributed | Coordination, distributed tasks, consistency. |
| UI | Frontend / UI | product-ui | Angular app, dashboard, demos, UX. |

## Cross-Domain Interaction

- Interaction is **only** via published APIs and gateway.
- No direct imports of one domain’s code into another’s logic; use HTTP/gRPC/events from the gateway or service-shell boundaries.
- Domain contracts (APIs, events) are owned by the domain that defines them; consumers depend on the contract, not the implementation.

## Platform Domain

- **Platform** owns: service-shells, gateway-layer, orchestration-layer, deployment-shells.
- Platform does not own business logic; it owns runtime, routing, discovery, and deployment.
