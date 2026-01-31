# DEC Validation: Engine-Intelligence Internals

This document validates engine-intelligence domain and service internals against the **Data Evidence Contract (DEC)**. It reports alignment, gaps, and recommendations. No runtime wiring or code changes are introduced; this is an audit only.

---

## Executive Summary

| Area | DEC requirement | Engine-intelligence current state | Status |
|------|-----------------|-----------------------------------|--------|
| **Evidence model** | Consume Evidence (id, type, subject, payload, confidence, freshness, source) | Does not consume DEC Evidence; uses internal “Evidence” (structural stats from raw inputs) | **Gap** |
| **Evidence types** | Reason differently over FACT, SIGNAL, AGGREGATE, DERIVED, EXTERNAL, MODEL_OUTPUT | No EvidenceType; no type-based weighting or staleness | **Gap** |
| **Evidence bundle** | Consume EvidenceBundle (queryId, evidence[], count, completeness) | No bundle; evaluation takes raw `inputs` dict only | **Gap** |
| **Confidence** | Use evidence.confidence; propagate; respect missing/partial | Confidence is computed from structural stats, not from supplied evidence | **Gap** |
| **Freshness** | Use evidence.freshness; downgrade/ignore stale | No freshness; no staleness policy | **Gap** |
| **Integration** | Request evidence by query/subject; respect completeness; cite evidence | No evidence request; no completeness; reasoning/signals are structural, not DEC citation | **Gap** |

**Conclusion:** Engine-intelligence is **not yet DEC-aligned**. It operates on raw `inputs` (dict) and an internal structural “Evidence” notion. To align with DEC when wiring is added, intelligence would need to accept EvidenceBundle(s), use DEC Evidence fields (type, subject, confidence, freshness, source), respect completeness, and cite evidence by id/type/source in explainability.

---

## 1. Evidence Model (DEC)

**Contract:** Evidence has id, type, subject (entityType, entityId), payload, confidence [0.0–1.0], optional trustScore, freshness (observedAt, expiresAt/ttl), source (engine, pipeline, index, version), optional constraints, tags.

**Engine-intelligence:**

| Artifact | Finding |
|----------|---------|
| `evaluation/request_evaluator.py` | Defines its own **Evidence** dataclass (lines 65–80): `num_keys`, `numeric_count`, `nested_count`, `numeric_sum`. This is structural extraction from a generic dict, not the DEC Evidence object. |
| `evaluate_request(context, inputs)` | Accepts `inputs: dict[str, Any]`. No parameter for Evidence[] or EvidenceBundle. No consumption of id, type, subject, payload, confidence, freshness, source. |
| `decision/decision_engine.py` | **DecisionContext** has `inputs` (dict) and `metadata` (dict). No evidence array, no subject (entityType, entityId). |
| `reasoning/reasoning_engine.py` | **Fact** is predicate + args (logical fact). Not DEC Evidence. |
| `inference/inference_engine.py` | **Premise** (label, value); **Conclusion** (outcome, confidence). No DEC Evidence or subject. |

**Gaps:**

- No type, subject, freshness, or source in any intelligence input.
- Internal “Evidence” is a different concept (structural stats); name collision with DEC Evidence.
- Payload is not interpreted in the context of DEC Evidence envelope (no type/subject/confidence/freshness).

---

## 2. Evidence Types (DEC)

**Contract:** EvidenceType = FACT | SIGNAL | AGGREGATE | DERIVED | EXTERNAL | MODEL_OUTPUT. Intelligence should reason differently (primary use, staleness, confidence, explainability, trust).

**Engine-intelligence:**

| Artifact | Finding |
|----------|---------|
| `request_evaluator.py` | No EvidenceType. No distinction between fact vs signal vs aggregate vs derived vs external vs model output. |
| `_outcome_scorer`, `evaluate_request` | Single path: extract structural evidence from `inputs`, compute confidence from that, score options. No type-based weighting or staleness. |
| `reasoning_engine.py` | Facts are logical (predicate + args); not typed as DEC FACT/SIGNAL/… . |

**Gaps:**

- No EvidenceType enum or handling.
- No type-based primary use, staleness, or citation style.

---

## 3. Evidence Bundle (DEC)

**Contract:** EvidenceBundle has queryId, evidence[], count, completeness (complete | partial | failed), optional determinismHash. Bundles are the only form for supplying evidence sets across the boundary.

**Engine-intelligence:**

| Artifact | Finding |
|----------|---------|
| `evaluate_request(context, inputs)` | No bundle parameter. Receives raw `inputs` only. |
| Decision flow | No queryId, no completeness, no determinismHash. No notion of “partial” or “failed” evidence set. |
| Service layer | `engine-intelligence-service` passes `inputs` from request body to `evaluate_request`; no EvidenceBundle. |

**Gaps:**

- Does not consume EvidenceBundle.
- Cannot respect completeness (complete / partial / failed) to downgrade or return “insufficient evidence.”
- No queryId for traceability or determinismHash for reproducibility.

---

## 4. Confidence and Freshness (DEC)

**Contract:** Confidence is supplied per evidence (0.0–1.0); intelligence uses it to weight/filter and propagate. Freshness (observedAt, expiresAt/ttl) is supplied per evidence; intelligence should downgrade or ignore stale evidence. Missing or partial evidence should affect evaluation (e.g. lower confidence, “insufficient evidence”).

**Engine-intelligence:**

| Artifact | Finding |
|----------|---------|
| `extract_evidence(inputs)` | Builds internal Evidence from structure (key count, numeric count, nested count). No use of supplied confidence from data. |
| `evidence_to_confidence(evidence)` | **Computes** confidence from structural Evidence (base 0.5 + factors). DEC expects confidence to **come from** evidence items (data engine assigns). |
| `evaluate_request` | No freshness; no staleness policy; no observedAt/expiresAt/ttl. |
| `DecisionContext` | No completeness; cannot represent “partial” or “failed” evidence. |
| `observability/decision_traceability.py` | `validate_confidence(min, max)` exists; no link to evidence confidence or freshness. |

**Gaps:**

- Confidence is derived internally, not consumed from DEC Evidence.confidence.
- No freshness on inputs; no staleness handling.
- No handling of missing evidence (no bundle) or partial completeness.

---

## 5. Integration Guidelines (DEC)

**Contract:** Intelligence should (1) request evidence by query/subject, (2) receive EvidenceBundle, (3) respect completeness, (4) use type/confidence/freshness, (5) cite evidence (id, type, subject, source) for explainability, (6) not hard-code payload schema.

**Engine-intelligence:**

| Guideline | Current state |
|-----------|----------------|
| Request evidence by queryId and subject | Not applicable; no evidence request. Evaluation is invoked with raw `inputs`. |
| Receive EvidenceBundle | Does not receive bundle. |
| Respect completeness | No completeness field; cannot downgrade or surface “insufficient evidence” from bundle. |
| Use type, confidence, freshness | No type; confidence is computed, not consumed; no freshness. |
| Cite evidence for explainability | **Reasoning** and **signals** in EvaluationResult are structural (e.g. “evidence_keys=3 numerics=2”); not citation of evidence id, type, subject, source. |
| Do not depend on payload schema | Evaluation is generic over dict; no product schema in contract. This aligns with DEC. |

**Gaps:**

- No evidence request/response flow; no bundle; no completeness.
- No DEC-style citation (evidence id, type, subject, source).
- Only “do not depend on payload schema” is aligned (generic dict).

---

## 6. Recommendations (Future DEC Alignment)

When wiring engine-data to engine-intelligence is introduced, the following changes would align intelligence with DEC. **This document does not implement them.**

1. **Introduce a DEC-aware evaluation path (optional overload or new entrypoint).**
   - Accept an optional EvidenceBundle (or list of Evidence) in addition to or instead of raw `inputs`.
   - When bundle is present: use bundle.evidence[].confidence, freshness, type, subject, source; respect bundle.completeness and bundle.queryId.

2. **Resolve naming and model conflict.**
   - Rename or namespace the internal structural “Evidence” (e.g. `StructuralEvidence` or `InputSummary`) to avoid confusion with DEC Evidence.
   - Document that DEC Evidence is the boundary type; internal Evidence is a fallback when no bundle is supplied.

3. **Consume DEC Evidence fields when bundle is supplied.**
   - Use evidence.type to apply type-based weighting or filtering (per evidence-types.md).
   - Use evidence.confidence for weighting; do not overwrite with structural confidence when DEC confidence is present.
   - Use evidence.freshness to apply staleness (downgrade or ignore stale items).
   - Use evidence.subject (entityType, entityId) to scope evaluation and citation.

4. **Respect bundle completeness.**
   - If completeness is `partial` or `failed`, downgrade outcome confidence or return outcome “insufficient” / “partial evidence” per product policy.
   - Propagate queryId (and optional determinismHash) into traceability for audit.

5. **Explainability: cite DEC evidence.**
   - When evidence is from a bundle, include in reasoning/signals: evidence ids, types, and source (engine, pipeline, index) for items that contributed to the outcome.
   - Keep existing structural reasoning when no bundle is supplied (backward compatibility).

6. **Leave wiring, HTTP, and adapters out of scope.**
   - Contract validation does not require adding calls to engine-data or new API shapes; it only requires that when EvidenceBundle is provided to intelligence (by whatever mechanism), the above semantics are applied.

---

## 7. Document References

- [README.md](./README.md) — DEC purpose and scope
- [evidence-model.md](./evidence-model.md) — Canonical Evidence object
- [evidence-types.md](./evidence-types.md) — EvidenceType and intelligence handling
- [evidence-bundle.md](./evidence-bundle.md) — EvidenceBundle and completeness
- [confidence-and-freshness.md](./confidence-and-freshness.md) — Confidence and freshness semantics
- [integration-guidelines.md](./integration-guidelines.md) — How intelligence should consume evidence

---

**Validation date:** Performed against engine-intelligence domain and service as of this document. Re-validate after any change to evaluation, decision, or reasoning entrypoints or to DEC itself.
