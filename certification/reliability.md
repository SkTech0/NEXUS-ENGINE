# Reliability Certification

**Status:** Standard  
**Owner:** Platform Architecture / Certification  
**Classification:** Certification — Reliability  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS certifies engine and platform reliability: availability, fault tolerance, and recovery behavior. Reliability certification is required for commercial deployment and SLA commitments.

---

## 2. Certification Scope

- **Engines:** Availability under normal and fault conditions; recovery from failure (see engine-core/specs/engine-recovery-model.md).
- **APIs:** Availability and error rate over defined window; behavior under dependency failure.
- **Platform:** Aggregate availability and fault containment; no single point of failure without documentation and mitigation.

---

## 3. Reliability Dimensions

### 3.1 Availability

- **Metric:** Successful requests / total valid requests over certification window (e.g., 7 days, 30 days); excludes planned maintenance when documented.
- **Target:** Meet or exceed SLO (e.g., 99.9%); certification MUST use same definition as SLO (see ops/slo.md, sli.md).
- **Pass criteria:** Availability ≥ SLO target over certification window.

### 3.2 Fault Tolerance

- **Metric:** Behavior under injected faults (e.g., dependency down, node failure, network partition); see chaos.md and platform/distributed-standards/fault-tolerance.md.
- **Target:** No cascade failure; graceful degradation or failover; recovery within RTO (see ops/dr.md).
- **Pass criteria:** Fault injection tests pass per runbook; recovery and degradation meet documented behavior.

### 3.3 Recovery

- **Metric:** Recovery time and recovery point after failure (e.g., process restart, AZ failure).
- **Target:** RTO and RPO met per ops/dr.md; state restored correctly; no data loss beyond RPO.
- **Pass criteria:** Recovery tests (e.g., DR drill) pass; RTO and RPO documented and met.

---

## 4. Certification Process

- **Baseline:** Define certification window, SLO targets, fault scenarios, and pass criteria; document environment and configuration.
- **Test:** Run availability measurement over window; run fault injection and recovery tests per baseline.
- **Evaluate:** Compare availability to SLO; verify fault tolerance and recovery per criteria.
- **Report:** Certification report MUST include baseline, results, pass/fail, and any exceptions (e.g., planned maintenance excluded).
- **Frequency:** Availability certification is continuous (SLO monitoring); fault and recovery certification SHOULD be run on major releases or per release policy.

---

## 5. References

- [performance.md](./performance.md)
- [stability.md](./stability.md)
- [ops/slo.md](../ops/slo.md)
- [ops/sli.md](../ops/sli.md)
- [ops/dr.md](../ops/dr.md)
- [ops/chaos.md](../ops/chaos.md)
- [platform/distributed-standards/reliability.md](../platform/distributed-standards/reliability.md)
- [platform/distributed-standards/fault-tolerance.md](../platform/distributed-standards/fault-tolerance.md)
- [engine-core/specs/engine-recovery-model.md](../engine-core/specs/engine-recovery-model.md)
