# Performance Certification

**Status:** Standard  
**Owner:** Platform Architecture / Certification  
**Classification:** Certification — Performance  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS certifies engine and platform performance: latency, throughput, and resource utilization. Performance certification is required for commercial deployment and SLA commitments.

---

## 2. Certification Scope

- **Engines:** Per-engine latency and throughput under defined load and configuration.
- **APIs:** End-to-end latency (edge to response) and throughput per endpoint or operation.
- **Platform:** Aggregate throughput and latency under multi-tenant or multi-engine load.

---

## 3. Performance Dimensions

### 3.1 Latency

- **Metrics:** p50, p95, p99 (and optionally p99.9) for defined operations.
- **Targets:** Targets MUST be defined per engine or endpoint (e.g., decision API p99 < 500ms).
- **Conditions:** Certification MUST specify load (e.g., RPS), data size, and environment (e.g., staging, production-like).
- **Measurement:** Latency from request received to response sent; MUST exclude client-side delay; clock sync MUST be consistent.

### 3.2 Throughput

- **Metrics:** Requests per second (or messages per second) sustained without degradation.
- **Targets:** Targets MUST be defined per engine or endpoint (e.g., 1000 RPS for decision API).
- **Conditions:** Certification MUST specify acceptable latency and error rate under target throughput (e.g., p99 within SLO, error rate < 0.1%).
- **Measurement:** Sustained load over defined duration (e.g., 5 minutes); throughput and latency MUST be reported together.

### 3.3 Resource Utilization

- **Metrics:** CPU, memory, I/O per engine or per request (where applicable).
- **Targets:** Resource bounds MAY be defined for capacity planning (e.g., max memory per engine instance).
- **Conditions:** Certification MAY include resource utilization under target load; MUST be documented for capacity and cost.

---

## 4. Certification Process

- **Baseline:** Establish baseline (load profile, environment, and targets) and document.
- **Test:** Run performance tests (e.g., load tests, benchmarks) per baseline; collect latency, throughput, and resource metrics.
- **Evaluate:** Compare results to targets; pass if targets are met within variance (e.g., 5% margin); document variance and conditions.
- **Report:** Certification report MUST include baseline, results, pass/fail, and any caveats (e.g., single-tenant, specific hardware).
- **Frequency:** Certification SHOULD be run on each release (or per release policy); regression MUST trigger investigation.

---

## 5. References

- [stability.md](./stability.md)
- [scalability.md](./scalability.md)
- [reliability.md](./reliability.md)
- [ops/slo.md](../ops/slo.md)
- [ops/sli.md](../ops/sli.md)
- [platform/distributed-standards/sla.md](../platform/distributed-standards/sla.md)
