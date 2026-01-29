# Engine SLIs (Service Level Indicators)

**Status:** Standard  
**Owner:** Platform Operations  
**Classification:** Ops — SLI  
**Version:** 1.0

---

## 1. Purpose

This document defines the Service Level Indicators used to measure NEXUS engine and platform health. SLIs are the raw metrics that feed SLOs and error budgets; they must be well-defined and consistently collected.

---

## 2. SLI Definitions

### 2.1 Availability SLI

- **Indicator:** Count of successful requests vs total valid requests.
- **Success:** HTTP 2xx (or defined success set) within timeout; or per-operation success criteria.
- **Exclusions:** 4xx (client error), planned maintenance (when documented), and invalid requests MAY be excluded from denominator.
- **Source:** API gateway, engine metrics, or distributed tracing; MUST be consistent across components.

### 2.2 Latency SLI

- **Indicator:** Request duration (e.g., time from request received to response sent).
- **Percentiles:** p50, p95, p99 (or p99.9) over a defined window.
- **Scope:** Per endpoint, per engine, or per operation; MUST exclude client-side delay.
- **Source:** APM, tracing, or gateway metrics; clock sync MUST be consistent.

### 2.3 Throughput SLI

- **Indicator:** Requests per second (or messages per second) accepted and processed.
- **Scope:** Per API, per engine, per tenant (where applicable).
- **Source:** Gateway or engine counters; MUST be sampled or aggregated consistently.

### 2.4 Error Rate SLI

- **Indicator:** Count of server-side errors (5xx, timeouts) vs total requests.
- **Scope:** Per API, per engine; MAY be broken down by error type for debugging.
- **Source:** Same as availability; errors MUST be categorized (transient vs permanent) where possible.

---

## 3. Collection and Aggregation

- **Collection:** SLIs MUST be collected from production; sampling MUST be documented and sufficient for percentiles.
- **Aggregation:** Aggregation window (e.g., 1 min, 5 min) and retention MUST be defined; rollup MUST preserve SLO evaluation needs.
- **Labels:** SLIs SHOULD be labeled by tenant, engine, endpoint, and tier so that SLO can be evaluated per scope.

---

## 4. SLI to SLO Mapping

- Each SLO (see slo.md) MUST be defined in terms of one or more SLIs (e.g., availability SLO = availability SLI > 99.9%).
- SLI definitions MUST be stable; changes to SLI definition require SLO and error budget review.

---

## 5. References

- [slo.md](./slo.md)
- [error-budgets.md](./error-budgets.md)
- [platform/distributed-standards/sla.md](../platform/distributed-standards/sla.md)
- [docs/engineering/observability.md](../docs/engineering/observability.md)
