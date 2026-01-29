# Distributed Reliability Standards

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Distributed System — Reliability  
**Version:** 1.0

---

## 1. Purpose

This document defines reliability expectations for NEXUS as a distributed system: availability targets, consistency expectations, and failure handling so that the platform meets commercial and operational requirements.

---

## 2. Availability

### 2.1 Targets

- **Platform tier:** Availability targets MUST be defined per component or service (e.g., 99.9% for core APIs).
- **Engine tier:** Engine availability MAY be expressed as a function of dependency availability and recovery time; targets MUST be documented in SLOs (see ops/slo.md).

### 2.2 Measurement

- Availability MUST be measured over a defined window (e.g., 30 days) and reported as successful requests / total requests (excluding planned maintenance when documented).
- Planned maintenance MUST be excluded from availability calculation only if communicated and within maintenance windows.

---

## 3. Failure Handling

- **Transient failures:** Handled by retries and circuit breakers per resilience.md.
- **Permanent failures:** Handled by failover, degradation, or clear error to caller; no silent drop.
- **Partial failures:** Degraded mode and backpressure per resilience and fault-tolerance; state MUST remain consistent per state-model (governance).

---

## 4. Data Reliability

- Writes that are acknowledged to the client MUST be durable per storage contract (e.g., replicated, fsync).
- Read-your-writes and session consistency MUST be documented where offered; stronger guarantees (e.g., linearizability) MUST be explicitly stated and scoped.

---

## 5. References

- [resilience.md](./resilience.md)
- [fault-tolerance.md](./fault-tolerance.md)
- [sla.md](./sla.md)
- [ops/slo.md](../../ops/slo.md)
- [ops/reliability.md](../../certification/reliability.md)
