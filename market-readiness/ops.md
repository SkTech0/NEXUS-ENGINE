# Operational Readiness for Market

**Status:** Standard  
**Owner:** Platform Operations / Product  
**Classification:** Market Readiness — Ops  
**Version:** 1.0

---

## 1. Purpose

This document defines when NEXUS is operationally ready for market: SLO/error budget, incident response, DR, runbooks, and support. Operational readiness is required for commercial launch and SLA commitments.

---

## 2. Operational Readiness Criteria

### 2.1 SLO and Error Budget

- **SLOs defined:** Per ops/slo.md; availability, latency, throughput, error rate per API/engine/tier.
- **SLIs collected:** Per ops/sli.md; dashboards and reporting operational.
- **Error budget in use:** Error budget consumed and policy applied per ops/error-budgets.md; release and incident response consider error budget.
- **Reporting:** SLO compliance and error budget visibility regular (e.g., weekly); trends and burn rate visible.

### 2.2 Incident Response

- **Classification and severity:** SEV-1–4 defined; classification criteria and response targets per ops/incident-response.md.
- **Escalation:** On-call and escalation path defined; escalation policy documented and tested.
- **Post-incident:** PIR for SEV-1/2; action items tracked; runbooks updated from findings.
- **Communication:** Status page and/or customer communication process for incidents; internal stakeholder updates.

### 2.3 Disaster Recovery

- **RTO/RPO defined:** Per ops/dr.md; per component or platform.
- **DR runbooks:** Failover and recovery runbooks documented and owned; DR drill at least annually (or per compliance).
- **Backup and replication:** Backup and replication per RPO; restore tested periodically.
- **Communication:** DR declaration and recovery communication process.

### 2.4 Runbooks and Chaos

- **Runbooks:** Key failure modes and operational tasks have runbooks per ops/runbooks.md; ownership and review rhythm.
- **Chaos:** Chaos standards and experiments per ops/chaos.md; findings fed into runbooks and resilience; no unacceptable impact from experiments.
- **Certification:** Stability and reliability certification (certification/stability.md, reliability.md) support operational confidence.

### 2.5 Support Process

- **Support tiers:** Support tiers (e.g., L1, L2, L3) and SLAs for commercial customers defined.
- **Escalation to engineering:** Escalation path from support to engineering; on-call and incident response integrated.
- **Documentation:** Customer-facing docs (API, SDK, runbooks where appropriate) and internal runbooks; docs kept current.

---

## 3. Gate Alignment

- Operational readiness is a core input to **Platform Readiness Gate** (gates/platform-readiness-gate.md) and **Market Entry Gate** (gates/market-entry-gate.md).
- Enterprise and regulated customers may require stricter ops criteria (gates/enterprise-gate.md).

---

## 4. References

- [ops/slo.md](../ops/slo.md)
- [ops/sli.md](../ops/sli.md)
- [ops/error-budgets.md](../ops/error-budgets.md)
- [ops/incident-response.md](../ops/incident-response.md)
- [ops/dr.md](../ops/dr.md)
- [ops/runbooks.md](../ops/runbooks.md)
- [ops/chaos.md](../ops/chaos.md)
- [gates/platform-readiness-gate.md](../gates/platform-readiness-gate.md)
- [gates/market-entry-gate.md](../gates/market-entry-gate.md)
