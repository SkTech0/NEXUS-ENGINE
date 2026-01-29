# Engine Readiness Levels (ERL) Model

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Readiness  
**Version:** 1.0

---

## 1. Purpose

This document defines the Engine Readiness Level (ERL) scale for NEXUS: a maturity scale from research to critical-infrastructure engine. ERL is used to assess current status, plan roadmap, and communicate engine maturity to customers and regulators.

---

## 2. ERL Scale

| ERL | Name | Description | Typical Use |
|-----|------|-------------|-------------|
| **ERL-1** | Research engine | Experimental; not for production; no SLA or support. | R&D, proof of concept. |
| **ERL-2** | Prototype engine | Functional prototype; limited testing; no production SLA. | Internal demo, pilot. |
| **ERL-3** | Platform engine | Integrated into platform; contract and lifecycle compliant; tested; limited SLA. | Internal production, early adopters. |
| **ERL-4** | Enterprise engine | Full lifecycle, resilience, observability; SLO and runbooks; support process. | Enterprise deployment, commercial pilot. |
| **ERL-5** | Commercial engine | Market-grade; SLA, deprecation, compatibility; certified (performance, stability, reliability). | Sellable product, commercial launch. |
| **ERL-6** | Regulated-industry engine | ERL-5 + compliance (e.g., audit, lineage, retention); documented for regulatory review. | Financial, healthcare, government. |
| **ERL-7** | Critical-infrastructure engine | ERL-6 + DR, chaos, formal verification where applicable; highest assurance. | Critical systems, safety-critical. |

---

## 3. Criteria by ERL

### ERL-1 (Research)

- No production commitment; no SLA; no formal contract.
- May have minimal tests; no certification.

### ERL-2 (Prototype)

- Implements engine contract (execute, name); may not implement full lifecycle.
- Basic tests; no certification; no SLA.

### ERL-3 (Platform)

- Full engine contract and lifecycle (engine-core/specs); state machine and orchestration compliant.
- Contract tests; integration tests; no formal certification; limited SLA (e.g., best-effort).

### ERL-4 (Enterprise)

- Resilience (circuit breaker, timeout, retry); observability (metrics, logs, tracing); SLO and runbooks.
- Stability and performance tested; incident response and DR procedures; support process.

### ERL-5 (Commercial)

- API versioning, deprecation, compatibility; consumer contracts and SDK strategy; certified (performance, stability, reliability, scalability).
- SLA and error budget; security (authn, authz, zero-trust); market-ready documentation.

### ERL-6 (Regulated)

- ERL-5 + data lineage, decision lineage, retention; audit and compliance documentation; regulatory mapping (e.g., GDPR, sectoral).
- Certification (determinism, consistency) where required; compliance readiness (market-readiness/compliance.md).

### ERL-7 (Critical-Infrastructure)

- ERL-6 + DR and chaos certified; formal verification or highest assurance where applicable; disaster recovery and RTO/RPO documented and tested.
- Critical-infrastructure standards (e.g., safety, availability) per domain.

---

## 4. Assessment

- **Per engine:** Each engine (or engine type) is assessed against ERL criteria; current ERL is documented in current-status.md.
- **Per capability:** Platform capabilities (e.g., API, security, ops) may be assessed separately; overall platform ERL may be the minimum of component ERLs or defined per product.
- **Review:** ERL assessment is reviewed periodically (e.g., quarterly) and on major release; roadmap (roadmap.md) targets ERL progression.

---

## 5. References

- [erl-assessment.md](./erl-assessment.md)
- [current-status.md](./current-status.md)
- [roadmap.md](./roadmap.md)
- [engine-core/specs/](../specs/)
- [gates/engine-productization-gate.md](../../gates/engine-productization-gate.md)
- [market-readiness/](../../market-readiness/)
