# Decision Lineage

**Status:** Standard  
**Owner:** Platform Architecture / Data Governance  
**Classification:** Governance — Decision  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS tracks decision lineage: the full chain of inputs, models, rules, and engines that produced a given decision. Decision lineage is essential for explainability, audit, and regulatory compliance.

---

## 2. Scope

- **Decisions:** Approve/decline, scores, recommendations, flags, allocations, and any other engine output that affects a business outcome.
- **Chain:** Input data → engine(s) → intermediate outputs → final decision, including model versions and rule versions.

---

## 3. Lineage Model for Decisions

### 3.1 Required Attributes

- **Decision ID:** Unique identifier for the decision instance.
- **Correlation ID:** Request or workflow correlation ID tying the decision to a single logical invocation.
- **Timestamp:** When the decision was produced (and optionally when inputs were captured).
- **Engine(s):** Name and version of each engine that contributed to the decision.
- **Input lineage:** References to input datasets, events, or prior decisions (with versions).
- **Model/rule versions:** Model artifact version, rule set version, or config version used.
- **Output:** The decision value and any structured explanation (e.g., reasons, factors).

### 3.2 Optional Attributes

- **Intermediate steps:** For multi-engine workflows, the output of each step and its lineage.
- **Overrides or manual interventions:** Any human or policy override that affected the decision.
- **Replayability:** Reference to stored inputs and engine version so that the decision can be replayed (see engine-core/specs/engine-replay.md).

---

## 4. Capture Requirements

- Every decision emitted by the platform MUST be associated with decision lineage (at least decision ID, correlation ID, timestamp, engine name/version, input references).
- Lineage MUST be stored in a durable, access-controlled store; retention MUST meet compliance and audit requirements.
- Access to decision lineage MUST be audited.

---

## 5. Explainability

- Decision lineage supports explainability: “why did this decision occur?” is answered by walking the lineage (inputs, model, rules, engine version).
- Where the engine produces structured explanations (e.g., factor weights, rule hits), these MUST be included in or referenceable from the lineage record.

---

## 6. References

- [data-lineage.md](./data-lineage.md)
- [state-model.md](./state-model.md)
- [causality.md](./causality.md)
- [engine-core/specs/engine-replay.md](../../engine-core/specs/engine-replay.md)
- [engine-core/specs/engine-determinism.md](../../engine-core/specs/engine-determinism.md)
