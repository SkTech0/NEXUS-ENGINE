# Engine Lifecycle Specification

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Lifecycle  
**Version:** 1.0

---

## 1. Purpose

This document defines the canonical lifecycle model for all NEXUS engine instances. Engine lifecycle governs creation, activation, execution, suspension, recovery, and termination. Compliance is required for certification and commercial deployment.

---

## 2. Scope

- All engine types (intelligence, optimization, trust, distributed coordination, data, AI).
- Single-instance and multi-instance deployments.
- On-premise, cloud, and hybrid topologies.

---

## 3. Lifecycle States

| State | Code | Description | Allowed Transitions |
|-------|------|-------------|---------------------|
| **Uninitialized** | `UNINIT` | Engine created but not configured or bound to resources. | → Initializing |
| **Initializing** | `INIT` | Configuration loaded; dependencies resolving; no traffic accepted. | → Ready, Failed |
| **Ready** | `READY` | Fully initialized; accepting traffic; health checks passing. | → Running, Draining, Failed |
| **Running** | `RUNNING` | Actively executing workloads. | → Ready, Draining, Degraded, Failed |
| **Degraded** | `DEGRADED` | Operational with reduced capability or SLA. | → Running, Ready, Draining, Failed |
| **Draining** | `DRAIN` | No new work accepted; in-flight work completing. | → Stopped, Failed |
| **Stopped** | `STOPPED` | Gracefully shut down; no work in flight. | → Initializing, Terminated |
| **Failed** | `FAILED` | Unrecoverable or requiring manual intervention. | → Initializing, Terminated |
| **Terminated** | `TERM` | Resources released; engine instance no longer exists. | — |

---

## 4. Transitions and Guards

- **UNINIT → INIT:** Configuration and secrets available; dependency endpoints reachable.
- **INIT → READY:** All health checks pass; contract validation succeeds; no critical errors.
- **INIT → FAILED:** Timeout, dependency failure, or invalid configuration.
- **READY → RUNNING:** Explicit start or first request accepted per policy.
- **RUNNING → DEGRADED:** SLO breach, backpressure, or partial dependency failure.
- **RUNNING → DRAIN:** Graceful shutdown requested or orchestration signal.
- **DRAIN → STOPPED:** All in-flight work completed or drain timeout reached.
- **STOPPED → TERM:** Resource teardown requested and confirmed.

---

## 5. Lifecycle Hooks

Engines MUST support the following hooks (implementation may be no-op where not applicable):

| Hook | Invoked On | Contract |
|------|------------|----------|
| `onInitialize` | Entry to INIT | Async; may load config, connect to dependencies. |
| `onReady` | Entry to READY | Async; may warm caches, register with discovery. |
| `onStart` | Entry to RUNNING | Async; may start background workers. |
| `onDrain` | Entry to DRAIN | Async; must stop accepting new work. |
| `onStop` | Entry to STOPPED | Async; must release resources. |
| `onFail` | Entry to FAILED | Sync or async; must log and optionally alert. |

---

## 6. Observability

- Current state MUST be exposed via a dedicated lifecycle endpoint or health API.
- Every state transition MUST be logged with timestamp, from-state, to-state, and reason.
- State history MUST be retainable for audit (configurable retention).

---

## 7. Idempotency of Lifecycle Operations

- Transition requests (e.g., start, stop, drain) MUST be idempotent: requesting the same target state when already in that state MUST succeed with no side effects.
- Re-entrant initialization MUST be safe (e.g., double init is no-op or re-validates only).

---

## 8. References

- [engine-states.md](./engine-states.md) — State machine detail.
- [engine-contracts.md](./engine-contracts.md) — Interface contracts.
- [engine-recovery-model.md](./engine-recovery-model.md) — Recovery from FAILED/DEGRADED.
