# Distributed Resilience Standards

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Distributed System — Resilience  
**Version:** 1.0

---

## 1. Purpose

This document defines platform-wide resilience patterns for NEXUS: circuit breakers, bulkheads, timeouts, retries, and backpressure. All distributed components MUST align with these standards for production deployment.

---

## 2. Circuit Breakers

### 2.1 Definition

A circuit breaker prevents repeated calls to a failing dependency. After a threshold of failures, the circuit opens and calls fail fast until a probe or timeout allows half-open testing.

### 2.2 Requirements

- **States:** Closed (normal), Open (fail-fast), Half-Open (probe).
- **Configuration:** Failure threshold, open duration, and half-open probe count MUST be configurable per dependency.
- **Metrics:** State transitions MUST be emitted; open-state duration MUST be visible for SLO/incident correlation.

### 2.3 Scope

- Outbound calls to engines, data stores, and external APIs MUST be protected by a circuit breaker (or equivalent policy) where failure would cascade.

---

## 3. Bulkheads

### 3.1 Definition

Bulkheads isolate failure by limiting concurrency or resources per component or tenant so that one failing unit cannot exhaust shared resources.

### 3.2 Requirements

- **Concurrency limits:** Per-engine, per-tenant, or per-endpoint limits MUST be configurable.
- **Thread/connection pools:** Shared pools MUST have bounded size; isolation between critical and best-effort paths is recommended.
- **Queue bounds:** Incoming request queues MUST be bounded to prevent unbounded memory growth.

---

## 4. Timeouts

### 4.1 Requirements

- Every outbound call MUST have a configurable timeout.
- Timeout MUST be less than or equal to the caller’s own timeout (or SLA) so that propagation is consistent.
- On timeout, the caller MUST release resources and signal timeout (no indefinite hang).

---

## 5. Retries

### 5.1 Policy

- Retries MUST be applied only to operations that are idempotent or that use idempotency keys.
- Retry count, backoff (e.g., exponential), and jitter MUST be configurable.
- Retries MUST respect circuit breaker state (no retry when circuit is open unless in half-open probe).

---

## 6. Backpressure

- Components that cannot keep up MUST signal backpressure (e.g., reject new work, return 503, or propagate backpressure upstream).
- Upstream MUST honor backpressure (e.g., slow down or shed load) per platform policy (see backpressure.md).

---

## 7. References

- [reliability.md](./reliability.md)
- [backpressure.md](./backpressure.md)
- [fault-tolerance.md](./fault-tolerance.md)
- [qos.md](./qos.md)
- [engine-core/specs/engine-failure-model.md](../../engine-core/specs/engine-failure-model.md)
