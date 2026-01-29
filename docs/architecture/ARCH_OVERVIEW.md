# Architecture Overview

A mental model of the system: layers, engines, and flows. This is conceptual—for detailed diagrams and dependency graphs see ARCHITECTURE_MAP.md and DEPENDENCY_GRAPH.md.

---

## High-level architecture

Nexus is a **layered decision-intelligence platform**. Core defines contracts; engines implement them; the API exposes them over HTTP; the UI and other consumers use the API. Products sit on top as the user-facing value layer.

```
                    ┌─────────────────┐
                    │  engine-core     │  domain, interfaces, contracts
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  engine-distributed   engine-data      engine-intelligence
  engine-optimization  engine-ai        engine-trust
                             │
                             ▼
                    ┌─────────────────┐
                    │  engine-api      │  HTTP gateway
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   product-ui          saas-layer         monetization
   platform            enterprise         infra
```

**Rule:** Dependencies point inward. Core depends on nothing. Engines depend on core. API depends on engines. UI and SaaS depend on API (or interfaces). No arrow from core to API or UI.

---

## Layered view

### Platform (foundation)

- **engine-core:** Domain concepts, interfaces (e.g. EnginePort), contracts. No HTTP, no UI, no infra. The stable “what” that engines implement.
- **Engines (engine-*):** data, intelligence, optimization, AI, trust, distributed. Implement core contracts; provide capabilities (storage, reasoning, optimization, ML, security, coordination).
- **engine-api:** .NET HTTP gateway. Controllers, services, DTOs. Calls engines; exposes REST (and Swagger). Single entrypoint for UI and other clients.
- **infra:** Docker, K8s, CI/CD. Runtime and deployment only.

### Domain (capabilities)

Domain logic is **implemented** in engines and **orchestrated** in the API. engine-core stays domain-agnostic; product- or domain-specific logic lives in engine-api (e.g. Domain/Loan) and in product-ui (demo flows). “Domain” here means: the problem space (lending, hiring, fraud) and the rules and models that the API and UI use.

### Product (value layer)

Products are defined in `products/` and delivered via API + UI. They use platform and domain; they don’t replace them. See PRODUCT_GUIDE for how products map to demos and domains.

---

## Engine model

- **engine-core:** Defines the contract (e.g. execute(input) → result). No implementation.
- **engine-data:** Models, schemas, storage, pipelines, indexing, caching.
- **engine-intelligence:** Reasoning, inference, decision, planning, learning, evaluation.
- **engine-optimization:** Heuristics, solvers, schedulers, allocators, predictors.
- **engine-ai:** Models, training, inference, pipelines, features, registry (Python).
- **engine-trust:** Identity, reputation, verification, security, compliance, audit.
- **engine-distributed:** Consensus, replication, coordination, state, clocks, messaging.

Each engine **implements** core interfaces and **exposes** capabilities. The API composes them into flows (e.g. “validate → score → decide → explain”). Engines do not call the API or the UI.

---

## Data flow

- **Inbound:** User or client → product-ui (or another client) → engine-api → engines. Requests and DTOs flow in; engines read and compute.
- **Outbound:** Engines → engine-api (responses, DTOs) → product-ui (or other client). Engines do not push to UI; they return results to the API.
- **Persistence:** Handled by engine-data and domain-specific storage. API and UI do not own databases; they call services that use engines or repositories.

---

## Decision flow

1. Request enters via API (e.g. loan application, evaluation request).
2. API validates and maps to domain model.
3. API calls engines (intelligence, optimization, trust, AI) as needed for scoring, decision, or recommendation.
4. API aggregates results and applies domain rules (e.g. policy, risk) in Domain/*.
5. API returns decision + explanation (and optional metadata) to the client.
6. UI displays result and next steps.

Decision logic lives in engines and in API domain services; UI presents and triggers.

---

## Intelligence flow

- **engine-intelligence:** Core reasoning, inference, decision, planning.
- **engine-ai:** ML models, training, inference, feature pipelines.
- **engine-optimization:** Optimization and scheduling.

API orchestrates: e.g. “get features (data/ai) → run intelligence/optimization → run trust/audit → return decision.” Intelligence flows through the API; it doesn’t bypass to the UI.

---

## Trust flow

- **engine-trust:** Identity, reputation, verification, security, compliance, audit.
- Used for: verifying actors, scoring trust, audit trails, compliance checks.
- API calls trust services when a flow requires verification or audit (e.g. before or after a decision). Trust is a capability consumed by the API, not by the UI directly.

---

## Control flow

- **Who triggers what:** UI sends HTTP requests; API runs the pipeline and calls engines. Engines do not call back to UI or API for control.
- **Configuration and policy:** Stored and applied in API domain or engines (e.g. loan policy, risk thresholds). UI may send parameters; API enforces and applies policy.
- **Errors and fallbacks:** Handled in API and services; returned to UI as HTTP and DTOs. UI handles display and retry; it doesn’t drive engine internals.

---

## Integration flow

- **External systems:** Integrate via engine-api (REST). Future: webhooks, events, or adapters in API or platform.
- **SaaS / monetization / enterprise:** Consume API or specific endpoints; may add middleware or tenant context. They don’t replace the API; they sit beside or in front of it.
- **Multi-tenant:** Handled in saas-layer and API (e.g. tenant context in requests). Engines stay stateless or tenant-agnostic where possible; tenancy is an API/gateway concern.

---

## Evolution model

- **Core:** Change rarely; preserve backward compatibility on interfaces and contracts.
- **Engines:** Extend with new capabilities or new engines; keep core contracts. Prefer new modules over breaking changes.
- **API:** Add endpoints and domain slices; version if you must break. See versioning/ for policies.
- **UI:** Add routes and components; keep shell and navigation coherent. Lazy-load by route.
- **Products:** Add product folders and docs; add or extend API and UI for that product. Additive only.

---

## Extension model

- **New product:** New folder under `products/` + docs; then API domain and UI routes as needed.
- **New domain:** New or extended domain in engine-api (e.g. Domain/Hiring); new or extended demo in product-ui.
- **New engine capability:** New or extended module in the right engine; expose via API service and controller. Keep core interface stable.
- **New integration:** New endpoint or adapter in API or platform; don’t put integration logic in engine-core.

---

## Multi-domain model

Multiple domains (loan, hiring, fraud, etc.) coexist. Each has:

- **Product definition** in `products/`.
- **API slice** in engine-api (controllers, services, domain models).
- **UI slice** in product-ui (demo routes and components).

They share: engine-core, engines, API gateway, UI shell, infra. They differ in: domain logic, flows, and product docs.

---

## Multi-product model

Multiple products share the same platform. Each product:

- Has its own identity, scope, and roadmap in `products/<product>/`.
- Uses the same API and engines; may have dedicated endpoints or domain paths.
- Has its own demo or feature set in the UI (routes under `app/demo/` or similar).

Products don’t duplicate platform code. They compose platform capabilities into user-facing flows and narratives.

---

## Summary diagram (conceptual)

```
[User] → [product-ui] → [engine-api] → [engines] → [engine-core contracts]
                ↑              │            │
                │              └────────────┘
                │         (data, decision, trust, etc.)
                │
         [products: scope, narrative, demos]
```

- **Read left-to-right:** Request flows from UI to API to engines.
- **Read right-to-left:** Core defines contracts; engines implement; API exposes; UI and products consume.

Use this as your mental model. For exact dependencies and folder layout, see ARCHITECTURE_MAP.md and DEPENDENCY_GRAPH.md. For how to run and extend, see DEV_GUIDE.md and PRODUCT_GUIDE.md.
