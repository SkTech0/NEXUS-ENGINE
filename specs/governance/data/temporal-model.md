# Temporal Consistency Model

**Status:** Standard  
**Owner:** Platform Architecture / Data Governance  
**Classification:** Governance — Temporal  
**Version:** 1.0

---

## 1. Purpose

This document defines the temporal consistency guarantees that NEXUS provides: ordering of events, read-your-writes, session consistency, and optional stronger guarantees. Clarity on temporal model is required for correct application design and audit.

---

## 2. Definitions

- **Temporal consistency:** The guarantees about when a read observes a prior write (in real time or in a logical order).
- **Read-your-writes:** A read performed by the same client/session after a write MUST observe that write (or a later version).
- **Session consistency:** Guarantees hold within a session (e.g., same connection, same correlation ID).
- **Causal consistency:** Reads that are causally after a write observe that write (or later); causality is defined by message/execution order (see causality.md).
- **Linearizability:** Strong single-copy equivalence; rarely required for all operations and scoped where used.

---

## 3. Platform Guarantees

### 3.1 Default (Session / Read-Your-Writes)

- Within a single request (correlation ID), read-your-writes MUST hold: any read performed by the same request after a write sees that write.
- Across requests from the same tenant/session, session consistency SHOULD hold where the platform stores session or tenant-scoped state.

### 3.2 Causal Consistency

- Where multi-step workflows and cross-engine calls are involved, causality MUST be preserved: the order of engine outputs and decisions MUST be reconstructable (see causality.md, decision-lineage.md).
- Causal consistency MAY be offered for specific stores or APIs; scope MUST be documented.

### 3.3 Stronger Guarantees (Scoped)

- Linearizability or strong consistency MAY be offered for specific operations (e.g., leader-elected writer, single-region critical path); MUST be explicitly documented and scoped.
- Use of stronger guarantees MUST be justified (e.g., compliance, correctness); default remains session/causal where possible for availability and performance.

---

## 4. Time and Ordering

- **Wall-clock time:** Timestamps used for audit and lineage MUST be from a consistent time source (e.g., NTP-synced); clock skew MUST be bounded and documented.
- **Logical ordering:** Where event ordering matters (e.g., event log), sequence numbers or logical timestamps MUST be used so that order is unambiguous across nodes.
- **Version vectors:** Where multiple writers or regions exist, version vectors or hybrid logical clocks MAY be used to establish order; approach MUST be documented.

---

## 5. References

- [causality.md](./causality.md)
- [state-model.md](./state-model.md)
- [decision-lineage.md](./decision-lineage.md)
- [platform/distributed-standards/reliability.md](../../platform/distributed-standards/reliability.md)
- [engine-core/specs/engine-determinism.md](../../engine-core/specs/engine-determinism.md)
