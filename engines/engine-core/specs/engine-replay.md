# Engine Replay Specification

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Replay  
**Version:** 1.0

---

## 1. Purpose

This document specifies how NEXUS engines support replay of past executions for audit, debugging, and compliance. Replay is the ability to re-execute a historical decision or workflow with the same inputs and environment to reproduce or verify the outcome.

---

## 2. Replay Prerequisites

- **Recorded inputs:** Every execution that is replayable MUST have its logical inputs stored or referenceable (e.g., by correlation ID and event store).
- **Versioned engine and config:** Replay MUST use the same engine version and configuration (or documented equivalent) that produced the original result.
- **Determinism:** Replay is meaningful only if the engine is deterministic (strong or weak) for that execution (see engine-determinism.md).

---

## 3. Replay Modes

### 3.1 Full Replay

- Re-execute the engine with exact recorded inputs and same engine version/config.
- Expected outcome: same output as original (within determinism guarantee).
- Use: audit, certification, debugging.

### 3.2 Dry Replay (Validation Only)

- Run replay in a side path without persisting output or triggering side effects.
- Use: verify that current engine version would produce the same result (regression check).

### 3.3 Replay with Overrides

- Replay with one or more inputs overridden (e.g., “what if” analysis).
- MUST be clearly distinguished from full replay in logs and audit; MUST NOT overwrite original decision record.

---

## 4. Storage and Retention

- Inputs (and optionally outputs) required for replay MUST be retained per governance and compliance policy.
- Retention period and format MUST be documented; access to replay data MUST be access-controlled and audited.

---

## 5. Traceability

- Every replayed execution MUST be tagged as replay (e.g., `replay=true`, original correlation ID, replay timestamp) so that it is not confused with live traffic in metrics and logs.

---

## 6. References

- [engine-determinism.md](./engine-determinism.md)
- [engine-idempotency.md](./engine-idempotency.md)
- [governance/data/decision-lineage.md](../governance/data/decision-lineage.md)
- [governance/data/state-model.md](../governance/data/state-model.md)
