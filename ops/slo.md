# Engine SLOs (Service Level Objectives)

**Status:** Standard  
**Owner:** Platform Operations  
**Classification:** Ops — SLO  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS expresses and measures Service Level Objectives for engines and platform components. SLOs are internal targets that drive error budgets, release gates, and incident response.

---

## 2. SLO Dimensions

### 2.1 Availability SLO

- **Definition:** Target percentage of successful requests (e.g., 99.9% over 30 days).
- **Measurement:** Successful requests / total valid requests; excludes client errors (4xx) and planned maintenance when documented.
- **Scope:** Per API, per engine, or per tier (critical vs best-effort).

### 2.2 Latency SLO

- **Definition:** Target percentile latency (e.g., p99 < 500ms for decision API).
- **Measurement:** Request duration from edge to response; percentiles over a rolling window (e.g., 30 days).
- **Scope:** Per endpoint or per operation; MAY vary by tier.

### 2.3 Throughput SLO

- **Definition:** Target requests per second (or messages per second) that the platform sustains.
- **Measurement:** Sustained throughput over a defined window; MAY include burst allowance.
- **Scope:** Per API, per tenant (where contracted), or global.

### 2.4 Error Rate SLO

- **Definition:** Target maximum server-side error rate (e.g., 5xx + timeouts < 0.1%).
- **Measurement:** Error count / total requests over the same window as availability.
- **Scope:** Per API or per engine; MAY be derived from availability SLO.

---

## 3. SLO vs SLA

- **SLO:** Internal target; used for error budgets, alerts, and release decisions.
- **SLA:** External commitment to customers; SLA MAY be equal to or looser than SLO (e.g., SLO 99.9%, SLA 99.5%).
- SLO MUST be at least as strict as SLA where SLA exists; violations of SLO MUST trigger review (see error-budgets.md).

---

## 4. Measurement and Reporting

- **SLIs:** Each SLO is measured by one or more SLIs (see sli.md); SLI definitions MUST be documented and automated.
- **Window:** SLOs are evaluated over a defined window (e.g., 30 days); burn rate and short-window alerts MAY be used for faster response.
- **Reporting:** SLO compliance MUST be reported regularly (e.g., dashboards, weekly report); trends MUST be visible for capacity and improvement.

---

## 5. References

- [sli.md](./sli.md)
- [error-budgets.md](./error-budgets.md)
- [platform/distributed-standards/sla.md](../platform/distributed-standards/sla.md)
- [incident-response.md](./incident-response.md)
