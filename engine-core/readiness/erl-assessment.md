# ERL Assessment Process

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Readiness  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS assesses engine and platform readiness against the Engine Readiness Level (ERL) scale. Assessment is used to determine current ERL, gaps, and actions to progress to the next level.

---

## 2. Assessment Scope

- **Per engine:** Each engine (e.g., intelligence, optimization, trust, distributed coordination) is assessed against ERL criteria (see erl-model.md).
- **Per platform capability:** API platform, security, ops, governance, and certification are assessed; overall platform ERL may be defined as the minimum of component ERLs or per product scope.
- **Per product:** Product-level ERL may be defined for sellable products (e.g., NEXUS Loan Engine at ERL-5).

---

## 3. Assessment Method

### 3.1 Criteria Checklist

- For each ERL level, a checklist of criteria is derived from erl-model.md and linked specs (engine-core/specs, platform, governance, security, ops, api-platform, certification).
- **Pass:** Criterion is met (implemented, documented, and where applicable tested or certified).
- **Partial:** Criterion is partially met (e.g., documented but not fully implemented); gap and owner recorded.
- **Fail:** Criterion is not met; gap and owner recorded.

### 3.2 Evidence

- **Documentation:** Specs, runbooks, and policy docs are evidence for “documented” criteria.
- **Implementation:** Code, config, and deployment are evidence for “implemented” criteria.
- **Testing/Certification:** Test results, certification reports, and drill results are evidence for “tested” or “certified” criteria.

### 3.3 Current ERL

- **Definition:** Current ERL is the highest level for which all criteria are Pass.
- **Gaps:** Any Partial or Fail at the next level is recorded as a gap; gaps are prioritized for roadmap (roadmap.md).

---

## 4. Assessment Frequency

- **Quarterly:** Full ERL assessment for platform and key engines; update current-status.md and roadmap.
- **On release:** Assessment for changed components; ERL progression or regression documented in release notes.
- **On gate:** Assessment is input to gates (engine-productization-gate, platform-readiness-gate, market-entry-gate, enterprise-gate); gate criteria may require minimum ERL.

---

## 5. Outputs

- **Current ERL:** Documented in current-status.md (per engine and platform).
- **Gap list:** Gaps and owners; prioritized in roadmap.
- **Recommendation:** Recommendation for ERL progression (e.g., “achieve ERL-5 by Q2”) and dependency on gates.

---

## 6. References

- [erl-model.md](./erl-model.md)
- [current-status.md](./current-status.md)
- [roadmap.md](./roadmap.md)
- [gates/engine-productization-gate.md](../../gates/engine-productization-gate.md)
- [gates/platform-readiness-gate.md](../../gates/platform-readiness-gate.md)
- [gates/market-entry-gate.md](../../gates/market-entry-gate.md)
- [gates/enterprise-gate.md](../../gates/enterprise-gate.md)
