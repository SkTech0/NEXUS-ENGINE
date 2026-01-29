# Engine Recovery Model

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Recovery  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS engines recover from failure states (FAILED, DEGRADED) and from transient errors. Recovery behavior must be predictable and safe for production.

---

## 2. Recovery Scopes

### 2.1 Request-Level Recovery

- **Retry:** Transient failures MAY be retried according to platform retry policy (see engine retry semantics).
- **Fallback:** Where policy allows, fallback values or alternative engines MAY be used; decision MUST be logged for audit.
- **No silent retry of non-idempotent operations:** Non-idempotent operations MUST NOT be retried without explicit idempotency keys or compensation.

### 2.2 Engine-Level Recovery

- **From DEGRADED:** When dependencies restore or load drops, engine MAY transition DEGRADED → RUNNING or READY per health checks and policy.
- **From FAILED:** Recovery typically requires re-initialization (transition to INIT). Orchestration or operator MAY trigger re-init; engine MUST support clean re-init from FAILED.

### 2.3 Process/Node Recovery

- After process restart, engine MUST restore state from persistent store (if any) and re-enter lifecycle at the appropriate state (e.g., READY or RUNNING if state was persisted).
- If no persistent state, engine starts as UNINIT and proceeds through INIT → READY.

---

## 3. Recovery Invariants

- Recovery MUST NOT violate consistency guarantees (see engine-determinism.md and governance temporal-model).
- Recovery MUST NOT replay already-acknowledged side effects (e.g., duplicate outbound messages) unless explicitly designed for at-least-once with deduplication.
- Recovery actions MUST be logged and, where applicable, reflected in metrics (e.g., recovery count, recovery duration).

---

## 4. Automated vs Manual Recovery

- **Automated:** Transient retries, DEGRADED→RUNNING on health improvement, and (where configured) FAILED→INIT retry with backoff.
- **Manual:** Critical failures MAY require operator approval before re-init or scale actions; policy and runbooks define when manual intervention is required.

---

## 5. References

- [engine-failure-model.md](./engine-failure-model.md)
- [engine-lifecycle.md](./engine-lifecycle.md)
- [engine-idempotency.md](./engine-idempotency.md) (retry semantics)
- [platform/distributed-standards/resilience.md](../platform/distributed-standards/resilience.md)
- [ops/dr.md](../ops/dr.md)
