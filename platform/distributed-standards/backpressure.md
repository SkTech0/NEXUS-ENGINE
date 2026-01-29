# Backpressure Standards

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Distributed System — Backpressure  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS components signal and respond to backpressure when downstream or local capacity is exceeded. Backpressure prevents cascade failure and ensures fair resource use.

---

## 2. Definition

**Backpressure** is the mechanism by which a component that cannot accept more work signals upstream to slow down or reject new work until capacity is restored.

---

## 3. Signaling Backpressure

### 3.1 At the Edge (API / Gateway)

- When the platform or engine cannot accept more requests, it MUST respond with a clear signal:
  - **HTTP:** 503 Service Unavailable, optionally with Retry-After.
  - **Async:** Reject message, NACK, or delay acceptance per protocol.
- Clients MUST be able to distinguish backpressure (retry later) from permanent errors (do not retry same request).

### 3.2 Between Internal Components

- Internal callers MUST respect backpressure (e.g., 503, queue full, or explicit backpressure token).
- Propagation: backpressure from a downstream engine SHOULD propagate upstream so that load is shed at the edge or at a designated shed point (see load shedding in resilience).

---

## 4. Responding to Backpressure

- **Callers:** MUST back off (exponential or policy-based) when receiving backpressure; MUST NOT blindly retry at full rate.
- **Orchestrators:** MUST not dispatch new work to a component that is signaling backpressure until the signal is cleared or a probe succeeds.
- **Queues:** Bounded queues MUST reject or block when full; rejection MUST be surfaced as backpressure to the producer.

---

## 5. Integration with Rate Limiting and Load Shedding

- Rate limiting (see qos.md) may proactively reject excess load before resources are exhausted; this is a form of proactive backpressure.
- Load shedding (dropping or degrading low-priority work under overload) MUST be documented and MUST respect priority/SLA tiers (see sla.md, qos.md).

---

## 6. References

- [resilience.md](./resilience.md)
- [qos.md](./qos.md)
- [sla.md](./sla.md)
- [engine-core/specs/engine-failure-model.md](../../engine-core/specs/engine-failure-model.md)
