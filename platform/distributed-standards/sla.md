# SLA Standards

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Distributed System — SLA  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS expresses and enforces Service Level Agreements: latency, throughput, availability, and error rate. SLAs are the basis for SLOs, error budgets, and commercial commitments.

---

## 2. SLA Dimensions

### 2.1 Availability

- **Definition:** Percentage of valid requests that receive a successful response (e.g., 2xx or defined success set) over a measurement window.
- **Exclusions:** Planned maintenance, client-caused errors (4xx), and documented exclusions MUST be defined in the SLA.

### 2.2 Latency

- **Definition:** Percentile latency (e.g., p50, p95, p99) for defined operations.
- **Scope:** Per endpoint or per operation; MAY vary by tier (critical vs best-effort).

### 2.3 Throughput

- **Definition:** Requests per second (or messages per second) that the platform guarantees to process under normal conditions.
- **Burst:** Burst allowance (e.g., token bucket) MAY be specified separately.

### 2.4 Error Rate

- **Definition:** Percentage of requests that result in server-side errors (5xx) or timeouts; MAY be capped per SLA tier.

---

## 3. SLA Tiers

- **Tier 1 (Critical):** Highest availability and lowest latency; e.g., real-time decision API.
- **Tier 2 (Standard):** Standard availability and latency.
- **Tier 3 (Best-effort):** Best effort; may be delayed or shed under load.

Tier MUST be identifiable per request (e.g., tenant contract, header) and enforced by QoS and load shedding.

---

## 4. Enforcement and Monitoring

- SLOs (ops/slo.md) MUST be derived from SLA commitments; error budgets (ops/error-budgets.md) drive release and incident response.
- Violations MUST be detectable by SLI metrics and MUST trigger alerts and/or remediation per policy.

---

## 5. References

- [qos.md](./qos.md)
- [ops/slo.md](../../ops/slo.md)
- [ops/error-budgets.md](../../ops/error-budgets.md)
- [reliability.md](./reliability.md)
