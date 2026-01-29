# Engine Determinism Guarantees

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Determinism  
**Version:** 1.0

---

## 1. Purpose

This document defines the determinism guarantees that NEXUS engines provide or aspire to. Determinism is essential for replay, audit, debugging, and regulatory consistency.

---

## 2. Definitions

- **Deterministic execution:** For the same logical input (and versioned engine/config), the engine produces the same logical output.
- **Logical input:** Input that is semantically equivalent (e.g., same business payload; ordering of fields or non-semantic metadata may differ if excluded from the contract).
- **Logical output:** Output that is semantically equivalent for the purpose of the contract.

---

## 3. Guarantee Levels

### 3.1 Strong Determinism (Target for Core Decision Engines)

- Same (versioned) engine + same logical input + same configuration → same logical output.
- No dependence on wall-clock time, random number generator, or external state beyond the declared input.
- Required for: regulatory replay, certification, and strict audit trails.

### 3.2 Weak Determinism (Acceptable for Many Engines)

- Same engine + same input → same output under the same “environment” (e.g., same model version, same snapshot of reference data).
- External factors (e.g., model version, reference data) are versioned and recorded so that replay can reproduce the environment.

### 3.3 Non-Deterministic (Documented Exception)

- Engines that intentionally use randomness (e.g., sampling, A/B) or live external data MUST document this and MUST record enough context (e.g., seed, timestamp, data version) to reproduce or explain results for audit.

---

## 4. Requirements

- Every engine MUST document its determinism level (strong, weak, or non-deterministic with explanation).
- For strong or weak determinism, the engine MUST NOT rely on undocumented side effects (e.g., global mutable state, unversioned external data) that would break reproducibility.
- Where non-determinism is unavoidable, lineage and audit MUST capture the factors that affect the outcome (see governance/decision-lineage.md).

---

## 5. Interaction with Replay and Idempotency

- Replay (engine-replay.md) depends on determinism for meaningful reproduction.
- Idempotency (engine-idempotency.md) ensures that retries do not change outcome; determinism supports idempotency when inputs are unchanged.

---

## 6. References

- [engine-replay.md](./engine-replay.md)
- [engine-idempotency.md](./engine-idempotency.md)
- [governance/data/decision-lineage.md](../governance/data/decision-lineage.md)
- [certification/determinism.md](../certification/determinism.md)
