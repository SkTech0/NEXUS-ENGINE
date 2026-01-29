# Engine Failure Model

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Failure  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS engines classify, signal, and handle failures. A consistent failure model is required for operational response, recovery automation, and SLA management.

---

## 2. Failure Classification

### 2.1 By Severity

| Severity | Code | Description | Engine State After |
|----------|------|-------------|--------------------|
| **Transient** | T | Temporary; retry may succeed | RUNNING or READY |
| **Degraded** | D | Partial failure; reduced capability | DEGRADED |
| **Fatal** | F | Unrecoverable for this request/job | RUNNING/READY (request failed) |
| **Critical** | C | Engine or process unrecoverable | FAILED |

### 2.2 By Domain

- **Input:** Invalid or malformed input → reject with client error (4xx); do not transition engine state.
- **Dependency:** External service or resource unavailable → Transient or Degraded per policy.
- **Resource:** OOM, connection exhaustion → Degraded or Fatal; backpressure applied.
- **Logic:** Bug, invariant violation → Fatal or Critical; must be logged and alerted.
- **Timeout:** Execution exceeded limit → Fatal for that request; engine state unchanged unless repeated timeouts trigger Degraded.

---

## 3. Failure Signaling

- **API:** Failures MUST be returned as structured errors (e.g., error code, message, correlation ID).
- **Logging:** Every failure MUST be logged with severity, code, correlation ID, and timestamp.
- **Metrics:** Failures MUST be counted by severity and (where applicable) by engine and operation for SLO/error budget.

---

## 4. Failure States (Engine-Level)

- **FAILED:** Reserved for Critical failures that prevent the engine from serving traffic (e.g., unrecoverable init failure, panic).
- **DEGRADED:** Used when the engine can still serve with reduced SLA (e.g., cache-only mode, fallback logic).
- **RUNNING/READY with failed requests:** Individual request failures do not necessarily change engine state; repeated or sustained failure may trigger transition to DEGRADED or FAILED per policy.

---

## 5. Cascading and Isolation

- Failure in one engine MUST NOT silently crash or corrupt another; isolation (bulkheads, timeouts) is required.
- Orchestration MUST enforce failure boundaries so that a failing engine does not indefinitely block others (see engine-orchestration.md and platform resilience).

---

## 6. References

- [engine-recovery-model.md](./engine-recovery-model.md)
- [engine-lifecycle.md](./engine-lifecycle.md)
- [platform/distributed-standards/fault-tolerance.md](../platform/distributed-standards/fault-tolerance.md)
- [ops/incident-response.md](../ops/incident-response.md)
