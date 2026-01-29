# Fault Tolerance Standards

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Distributed System — Fault Tolerance  
**Version:** 1.0

---

## 1. Purpose

This document defines fault tolerance expectations for NEXUS: how the platform detects, contains, and recovers from faults without data loss or undefined behavior, and how it degrades gracefully under partial failure.

---

## 2. Fault Model

### 2.1 Assumed Faults

- **Process/node failure:** Crash, OOM, kill; node may disappear.
- **Network:** Partition, latency spike, message loss or duplication (depending on transport).
- **Dependency failure:** External service or data store unavailable or slow.
- **Resource exhaustion:** CPU, memory, connections, or disk.

### 2.2 Non-Goals (Out of Scope for This Document)

- Byzantine faults (malicious or arbitrary behavior) are out of scope unless explicitly addressed in security/trust model.
- Design for fault tolerance does not imply guarantee against all failure modes; recovery time and data loss bounds MUST be documented (e.g., in DR, SLO).

---

## 3. Detection

- **Health checks:** Liveness and readiness MUST be exposed; orchestrator and load balancers MUST use them to remove unhealthy instances.
- **Circuit breakers:** Outbound calls MUST be protected so that repeated calls to a failing dependency are stopped (see resilience.md).
- **Timeouts:** Every blocking call MUST have a timeout so that hung dependencies do not hold resources indefinitely.
- **Metrics and alerts:** Failure rates, latency, and saturation MUST be monitored; anomalies MUST trigger alerts per ops/incident-response.md.

---

## 4. Containment

- **Bulkheads:** Concurrency and resource limits per component/tenant MUST prevent one fault from exhausting shared resources (see resilience.md).
- **Isolation:** Engine failures MUST NOT corrupt other engines or shared state; failure boundaries MUST be explicit (e.g., process, container, or fault domain).
- **Backpressure:** Overloaded components MUST signal backpressure so that load is shed at the edge or at a controlled point (see backpressure.md).

---

## 5. Recovery

- **Automatic:** Transient failures recovered via retries and circuit half-open; process restarts via orchestrator; state restored from persistent store where applicable (see engine-core/specs/engine-recovery-model.md).
- **Degraded mode:** When a dependency is unavailable, engines MAY operate in degraded mode (e.g., cache-only, fallback) per policy; MUST transition back when dependency recovers.
- **Disaster recovery:** Regional or datacenter failure handled per ops/dr.md; RTO and RPO MUST be defined.

---

## 6. Consistency Under Faults

- Writes acknowledged to the client MUST be durable per storage contract; replication and failover MUST preserve acknowledged data per RPO.
- Read consistency (e.g., read-your-writes, causal) MUST be documented and MUST hold within the stated fault model (see governance/data/temporal-model.md).

---

## 7. References

- [resilience.md](./resilience.md)
- [reliability.md](./reliability.md)
- [backpressure.md](./backpressure.md)
- [engine-core/specs/engine-failure-model.md](../../engine-core/specs/engine-failure-model.md)
- [engine-core/specs/engine-recovery-model.md](../../engine-core/specs/engine-recovery-model.md)
- [ops/dr.md](../../ops/dr.md)
