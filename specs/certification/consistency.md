# Consistency Certification

**Status:** Standard  
**Owner:** Platform Architecture / Certification  
**Classification:** Certification — Consistency  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS certifies consistency guarantees: read-your-writes, session consistency, causal consistency, and (where applicable) stronger guarantees. Consistency certification is required for correct application behavior and audit.

---

## 2. Certification Scope

- **Data stores:** Read/write consistency guarantees (e.g., read-your-writes, session, causal) for platform and engine state.
- **APIs:** End-to-end consistency where APIs expose state (e.g., decision read after write); certification MAY include cross-request consistency.
- **Engines:** Consistency of engine state and decision lineage (e.g., decision and lineage written together; replay produces consistent view); see governance/data/temporal-model.md.

---

## 3. Consistency Dimensions

### 3.1 Read-Your-Writes

- **Definition:** A read performed by the same client/session after a write MUST observe that write (or a later version).
- **Test:** Write value V; read immediately (same session); assert read returns V (or later version).
- **Pass criteria:** 100% of read-your-writes tests pass; no stale read within session.

### 3.2 Session Consistency

- **Definition:** Guarantees hold within a session (e.g., same connection, same correlation ID); see governance/data/temporal-model.md.
- **Test:** Multi-step workflow within same session; assert each read observes prior writes of that session.
- **Pass criteria:** All session consistency tests pass; no violation within session.

### 3.3 Causal Consistency

- **Definition:** Reads that are causally after a write observe that write (or later); causality defined by message/execution order (see governance/data/causality.md).
- **Test:** Cross-request or cross-engine workflow; assert causal order is preserved (e.g., decision B reads output of decision A when B is causally after A).
- **Pass criteria:** Causal consistency tests pass; no causal violation.

### 3.4 Stronger Guarantees (Scoped)

- **Definition:** Linearizability or strong consistency where explicitly offered; scope MUST be documented.
- **Test:** Concurrent read/write tests (e.g., linearizability checker) for scoped operations.
- **Pass criteria:** Tests pass within stated scope; scope and limitations MUST be documented.

---

## 4. Certification Process

- **Baseline:** Define consistency level(s) to certify, test scenarios, and pass criteria; document scope (e.g., per store, per API).
- **Test:** Run consistency tests (read-your-writes, session, causal, or strong) per baseline; collect results.
- **Evaluate:** Pass if all tests pass; fail if any violation (and document if violation is in unsupported scope).
- **Report:** Certification report MUST include baseline, results, pass/fail, and scope/limitations.
- **Frequency:** Certification SHOULD be run on major releases or when consistency model changes; regression MUST trigger investigation.

---

## 5. References

- [determinism.md](./determinism.md)
- [governance/data/temporal-model.md](../governance/data/temporal-model.md)
- [governance/data/causality.md](../governance/data/causality.md)
- [governance/data/state-model.md](../governance/data/state-model.md)
- [platform/distributed-standards/reliability.md](../platform/distributed-standards/reliability.md)
