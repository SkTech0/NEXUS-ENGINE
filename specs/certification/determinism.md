# Determinism Certification

**Status:** Standard  
**Owner:** Platform Architecture / Certification  
**Classification:** Certification — Determinism  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS certifies engine determinism: that the same logical input and versioned engine/config produce the same logical output. Determinism certification is required for replay, audit, and regulatory consistency.

---

## 2. Certification Scope

- **Engines:** Core decision engines and engines that affect business outcomes; certification applies to engines that claim strong or weak determinism (see engine-core/specs/engine-determinism.md).
- **APIs:** APIs that expose deterministic engine execution; certification MAY include end-to-end determinism where applicable.
- **Exclusions:** Engines that are explicitly non-deterministic (e.g., sampling, live external data) are not certified for determinism; they MUST document factors that affect outcome and lineage (see governance/data/decision-lineage.md).

---

## 3. Determinism Dimensions

### 3.1 Strong Determinism

- **Definition:** Same (versioned) engine + same logical input + same configuration → same logical output; no dependence on wall-clock time, RNG, or external state beyond declared input.
- **Test:** Re-execute engine with same input and config N times (e.g., 100); compare outputs; pass if all outputs are logically equal.
- **Pass criteria:** 100% output match (or logical equivalence) across runs; no flakiness.

### 3.2 Weak Determinism

- **Definition:** Same engine + same input → same output under same “environment” (e.g., same model version, same snapshot of reference data); environment is versioned and recorded.
- **Test:** Re-execute engine with same input and same versioned environment N times; compare outputs; pass if all outputs are logically equal.
- **Pass criteria:** 100% output match (or logical equivalence) when environment is reproduced; environment version MUST be recorded for replay.

### 3.3 Replay Consistency

- **Definition:** Replay of a historical execution (see engine-core/specs/engine-replay.md) produces the same output as the original (within determinism guarantee).
- **Test:** Select historical executions; replay with stored inputs and engine version; compare replay output to stored output.
- **Pass criteria:** Replay output matches stored output (or is logically equivalent); any deviation MUST be documented and justified.

---

## 4. Certification Process

- **Baseline:** Define engine(s), input set, and determinism level (strong/weak); document configuration and environment versioning.
- **Test:** Run determinism tests (re-execution, replay) per baseline; collect outputs and compare.
- **Evaluate:** Pass if all comparisons meet criteria; fail if any flakiness or mismatch (and document if non-determinism is intentional).
- **Report:** Certification report MUST include baseline, results, pass/fail, and engine determinism level.
- **Frequency:** Certification SHOULD be run on each release for deterministic engines; regression (e.g., new non-determinism) MUST trigger investigation.

---

## 5. References

- [consistency.md](./consistency.md)
- [engine-core/specs/engine-determinism.md](../engine-core/specs/engine-determinism.md)
- [engine-core/specs/engine-replay.md](../engine-core/specs/engine-replay.md)
- [governance/data/decision-lineage.md](../governance/data/decision-lineage.md)
