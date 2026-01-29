# State Model and Versioned State

**Status:** Standard  
**Owner:** Platform Architecture / Data Governance  
**Classification:** Governance — State  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS models and governs state: versioned state, state snapshots, and consistency expectations. A clear state model is required for replay, audit, and disaster recovery.

---

## 2. State Categories

### 2.1 Engine State

- **Runtime state:** In-memory or process-local state (e.g., caches, connection state). May be lost on restart; recovery from persistent state or re-initialization.
- **Persistent engine state:** State that the engine writes to durable storage (e.g., checkpoints, idempotency store). MUST be versioned or timestamped where used for replay or recovery.

### 2.2 Application/Domain State

- **Decisions, scores, and business outcomes:** Stored with version (engine version, schema version) and lineage (see decision-lineage.md).
- **Aggregations and derived state:** Snapshots or materialized views with known schema version and refresh logic.

### 2.3 Reference Data

- **Models, rules, config:** Versioned artifacts; every execution that uses them MUST record the version used (see decision-lineage, engine-determinism).

---

## 3. Versioned State

- **Requirement:** Any state that affects the outcome of decisions or that is used for replay MUST be versioned (e.g., version number, timestamp, or content hash).
- **Immutability:** Published versions SHOULD be immutable; new state is a new version.
- **Retention:** Version history retention MUST align with audit and compliance policy.

---

## 4. State Snapshots

- **Definition:** A point-in-time copy of state (e.g., full or incremental) for recovery or audit.
- **Use:** Disaster recovery (ops/dr.md), replay (engine-replay), and debugging.
- **Frequency and retention:** Snapshot policy (how often, how long kept) MUST be defined per component and aligned with RPO/RTO.

---

## 5. Event Sourcing Readiness

- Where event sourcing is used or planned, state MUST be reconstructable from an event log; events MUST be ordered and versioned (e.g., sequence number, timestamp).
- Compatibility with this model (event schema versioning, retention) MUST be documented for components that emit or consume events.

---

## 6. Consistency

- Read-your-writes, session consistency, or stronger guarantees MUST be documented per store and per API (see temporal-model.md).
- State transitions MUST be consistent with the engine lifecycle and failure model (engine-core/specs).

---

## 7. References

- [decision-lineage.md](./decision-lineage.md)
- [temporal-model.md](./temporal-model.md)
- [causality.md](./causality.md)
- [engine-core/specs/engine-replay.md](../../engine-core/specs/engine-replay.md)
- [engine-core/specs/engine-states.md](../../engine-core/specs/engine-states.md)
- [ops/dr.md](../../ops/dr.md)
