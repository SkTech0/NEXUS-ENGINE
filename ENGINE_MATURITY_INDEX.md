# NEXUS Engine Maturity Program — Index

**Purpose:** This index points to all documents created under the Engine Maturity Program. The program audits, hardens, and standardizes NEXUS as a market-grade, sellable distributed intelligence engine. All artifacts are additive; no business logic or product flows were changed.

---

## 1. Engine Core Standards

**Location:** `engine-core/specs/`

| Document | Description |
|----------|-------------|
| [engine-lifecycle.md](engine-core/specs/engine-lifecycle.md) | Engine lifecycle states, transitions, hooks, idempotency of lifecycle ops |
| [engine-contracts.md](engine-core/specs/engine-contracts.md) | Engine interface contracts, identity, lifecycle, health, error/timeout |
| [engine-states.md](engine-core/specs/engine-states.md) | State machine model, events, transition matrix, invariants |
| [engine-orchestration.md](engine-core/specs/engine-orchestration.md) | Orchestration rules, dependency graph, execution graph |
| [engine-failure-model.md](engine-core/specs/engine-failure-model.md) | Failure classification, signaling, failure states, cascading/isolation |
| [engine-recovery-model.md](engine-core/specs/engine-recovery-model.md) | Request-, engine-, and process-level recovery; invariants |
| [engine-determinism.md](engine-core/specs/engine-determinism.md) | Determinism guarantees (strong, weak, non-deterministic) |
| [engine-replay.md](engine-core/specs/engine-replay.md) | Replay prerequisites, modes, storage, traceability |
| [engine-idempotency.md](engine-core/specs/engine-idempotency.md) | Idempotency requirements, key handling, storage, retries/replay |

---

## 2. Distributed System Standards

**Location:** `platform/distributed-standards/`

| Document | Description |
|----------|-------------|
| [resilience.md](platform/distributed-standards/resilience.md) | Circuit breakers, bulkheads, timeouts, retries, backpressure |
| [reliability.md](platform/distributed-standards/reliability.md) | Availability, failure handling, data reliability |
| [backpressure.md](platform/distributed-standards/backpressure.md) | Backpressure signaling and response; rate limiting, load shedding |
| [qos.md](platform/distributed-standards/qos.md) | Rate limiting, priority routing, resource allocation, fairness |
| [sla.md](platform/distributed-standards/sla.md) | SLA dimensions, tiers, enforcement |
| [fault-tolerance.md](platform/distributed-standards/fault-tolerance.md) | Fault model, detection, containment, recovery, consistency |

---

## 3. Data & State Governance

**Location:** `governance/data/`

| Document | Description |
|----------|-------------|
| [data-lineage.md](governance/data/data-lineage.md) | Data lineage model, capture, use cases |
| [decision-lineage.md](governance/data/decision-lineage.md) | Decision lineage model, capture, explainability |
| [state-model.md](governance/data/state-model.md) | State categories, versioned state, snapshots, event sourcing readiness |
| [causality.md](governance/data/causality.md) | Correlation IDs, trace propagation, causality chains |
| [temporal-model.md](governance/data/temporal-model.md) | Temporal consistency (read-your-writes, session, causal, linearizability) |

---

## 4. Engine Security Model

**Location:** `security/engine/`

| Document | Description |
|----------|-------------|
| [identity.md](security/engine/identity.md) | Engine and service identity; assertion; audit/tracing |
| [auth.md](security/engine/auth.md) | Consumer, engine-to-engine, system authentication |
| [authz.md](security/engine/authz.md) | Authorization model, policy enforcement, capability-based |
| [trust-model.md](security/engine/trust-model.md) | Trust assumptions, boundaries, threat model |
| [zero-trust.md](security/engine/zero-trust.md) | Zero-trust principles; application to API, engine-to-engine, data, ops |
| [policy.md](security/engine/policy.md) | Policy types, lifecycle, secure engine-to-engine comms |

---

## 5. Platform Operability

**Location:** `ops/`

| Document | Description |
|----------|-------------|
| [slo.md](ops/slo.md) | Engine/platform SLOs (availability, latency, throughput, error rate) |
| [sli.md](ops/sli.md) | SLI definitions, collection, aggregation |
| [error-budgets.md](ops/error-budgets.md) | Error budget policy, consumption, freeze, reporting |
| [incident-response.md](ops/incident-response.md) | Incident classification, response flow, escalation, PIR |
| [dr.md](ops/dr.md) | RTO/RPO, failure scenarios, DR procedures, replication/backup |
| [chaos.md](ops/chaos.md) | Chaos engineering standards, experiment lifecycle, types |
| [runbooks.md](ops/runbooks.md) | Runbook types, structure, maintenance, accessibility |

---

## 6. API Productization Standards

**Location:** `api-platform/`

| Document | Description |
|----------|-------------|
| [versioning.md](api-platform/versioning.md) | API versioning strategy (URL/header), semantic versioning |
| [deprecation.md](api-platform/deprecation.md) | Deprecation lifecycle, support period, sunset, breaking-change governance |
| [compatibility.md](api-platform/compatibility.md) | Backward-compatibility rules, compatibility matrix, upgrade paths |
| [contracts.md](api-platform/contracts.md) | Request/response/behavioral contracts; consumer contracts; contract testing |
| [sdk-strategy.md](api-platform/sdk-strategy.md) | SDK scope, versioning, distribution, stability guarantees |
| [api-governance.md](api-platform/api-governance.md) | Design review, breaking-change governance, stability, compliance |

---

## 7. Engine Benchmark Certification

**Location:** `certification/`

| Document | Description |
|----------|-------------|
| [performance.md](certification/performance.md) | Performance certification (latency, throughput, resource) |
| [stability.md](certification/stability.md) | Stability certification (latency/error/resource stability over time) |
| [scalability.md](certification/scalability.md) | Scalability certification (horizontal, vertical, overload) |
| [reliability.md](certification/reliability.md) | Reliability certification (availability, fault tolerance, recovery) |
| [determinism.md](certification/determinism.md) | Determinism certification (strong, weak, replay consistency) |
| [consistency.md](certification/consistency.md) | Consistency certification (read-your-writes, session, causal, strong) |

---

## 8. Engine Readiness Levels (ERL)

**Location:** `engine-core/readiness/`

| Document | Description |
|----------|-------------|
| [erl-model.md](engine-core/readiness/erl-model.md) | ERL scale (ERL-1 Research → ERL-7 Critical-infrastructure) |
| [erl-assessment.md](engine-core/readiness/erl-assessment.md) | ERL assessment process, criteria, evidence, outputs |
| [current-status.md](engine-core/readiness/current-status.md) | Current ERL per platform and engine; gaps |
| [roadmap.md](engine-core/readiness/roadmap.md) | Roadmap phases (ERL-4 → ERL-7); gates and milestones |

---

## 9. Market Readiness Model

**Location:** `market-readiness/`

| Document | Description |
|----------|-------------|
| [technical.md](market-readiness/technical.md) | Technical readiness (engine maturity, platform stability, API, governance) |
| [platform.md](market-readiness/platform.md) | Platform readiness (orchestration, multi-tenancy, scalability, ops) |
| [ops.md](market-readiness/ops.md) | Operational readiness (SLO, incident response, DR, runbooks, support) |
| [security.md](market-readiness/security.md) | Security readiness (identity, authn/authz, zero-trust, audit) |
| [legal.md](market-readiness/legal.md) | Legal readiness (ToS, privacy, liability, IP, contractual) |
| [compliance.md](market-readiness/compliance.md) | Compliance readiness (regulatory mapping, lineage, retention, audit, sectoral) |
| [enterprise.md](market-readiness/enterprise.md) | Enterprise readiness (multi-tenant, SSO, audit, support, commercial/legal) |

---

## 10. Engine Productization Gates

**Location:** `gates/`

| Document | Description |
|----------|-------------|
| [engine-productization-gate.md](gates/engine-productization-gate.md) | Gate for productized engine (contract, certification, API, security, governance) |
| [platform-readiness-gate.md](gates/platform-readiness-gate.md) | Gate for platform production readiness (orchestration, resilience, ops, multi-tenant) |
| [market-entry-gate.md](gates/market-entry-gate.md) | Gate for commercial market entry (technical, platform, ops, security, legal, compliance) |
| [enterprise-gate.md](gates/enterprise-gate.md) | Gate for enterprise and regulated-industry sales |

---

## Intent (Summary)

This program results in:

- A **certifiable** engine (certification specs and process)
- An **auditable** engine (lineage, causality, runbooks, incident response)
- A **governable** engine (governance/data, security/policy, api-governance)
- A **distributable** engine (distributed-standards, resilience, fault-tolerance)
- A **licensable** engine (API productization, contracts, SDK, legal readiness)
- A **sellable** engine (market-readiness, gates, ERL)
- A **standard-compliant** engine (engine-core/specs, platform standards)
- A **platform-grade, market-ready** engine foundation

No existing code was moved or refactored; all changes are additive markdown documents for hardening and standardization.
