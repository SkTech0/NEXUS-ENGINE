# Confidence and Freshness

This document defines how **confidence** and **freshness** are used in the Data Evidence Contract (DEC): how confidence is propagated, how stale evidence is treated, how missing or partial data affects evaluation, and how this contract conceptually interacts with a Trust engine. No runtime wiring or implementation is specified.

---

## Confidence

### Definition

**Confidence** is a number in [0.0, 1.0] attached to each Evidence item. It represents the data engine’s assessment of how reliable that evidence is at the time of supply. It is required so that engine-intelligence can weight evidence, apply thresholds, and explain why some evidence was discounted.

### Propagation

- **At source:** The data engine assigns confidence when producing evidence. Assignment may reflect: validation result, index quality, pipeline stage, or source reliability. DEC does not prescribe how the data engine computes confidence; it only requires that each evidence item carries a value in [0.0, 1.0].
- **At consumption:** Engine-intelligence consumes confidence as an input. It may:
  - Weight evidence by confidence when combining multiple items.
  - Filter out evidence below a threshold (e.g. ignore items with confidence below 0.5).
  - Propagate confidence into its own outcome (e.g. “evaluation confidence is bounded by minimum evidence confidence”).
  - Surface confidence in explainability (“this conclusion used evidence with confidence 0.8 and 0.9”).
- **Aggregation:** DEC does not define a single formula for aggregating confidence across evidence (e.g. min, weighted average). That is the responsibility of engine-intelligence. The contract only ensures that each evidence item has a confidence value so aggregation is possible.

### Missing or Partial Data

- **Missing evidence:** If a query returns no evidence (empty bundle or completeness = failed), intelligence has no confidence from data. Evaluation should reflect “no evidence” (e.g. lower outcome confidence, or outcome = “insufficient evidence”). DEC does not define the exact behavior; it establishes that absence of evidence is observable via bundle completeness and count.
- **Partial evidence:** If the bundle is partial (completeness = partial), some requested evidence may be missing. Intelligence should treat the bundle as incomplete: reasoning may proceed but outcome confidence or completeness flags should reflect that not all evidence was available. How to downgrade is an intelligence concern; DEC ensures the consumer knows the bundle was partial.

### Interaction with Trust Engine (Conceptual)

- **trustScore:** Evidence may carry an optional trustScore (0.0–1.0). Conceptually, a Trust engine could assign or enrich trust scores based on source reputation, lineage, or policy. DEC does not wire engine-data to engine-trust; it only defines the field so that when trust is integrated, evidence can carry a trust score without changing the Evidence model.
- **Combining confidence and trustScore:** Intelligence may combine confidence (from data) and trustScore (from trust) when both are present (e.g. minimum, product, or policy-based rule). DEC does not prescribe the combination; it enables it by having both fields in the model.

---

## Freshness

### Definition

**Freshness** is the time-bound validity of evidence. Each Evidence item has a **freshness** object with:
- **observedAt:** When the evidence was produced or last validated.
- **expiresAt** (optional): When the evidence is considered stale.
- **ttl** (optional): Time-to-live from observedAt; alternative to expiresAt.

### How Stale Evidence Should Be Treated

- **At supply:** The data engine sets observedAt and, when applicable, expiresAt or ttl. Evidence past expiresAt (or past observedAt + ttl) is stale.
- **At consumption:** Engine-intelligence should downgrade or ignore stale evidence:
  - **Downgrade:** Reduce confidence for evidence past its expiry (e.g. scale confidence by a time-decay factor, or cap at a lower value).
  - **Ignore:** Exclude evidence that is past expiry from reasoning.
  - **Flag:** In explainability, label evidence as stale so auditors and users know age was considered.
- DEC does not mandate a single policy (e.g. hard cutoff vs. gradual decay). It requires that freshness is present so that intelligence can implement a policy. Enterprise and regulated use cases may impose maximum age (e.g. “decisions only on evidence not older than X”); that is a product or compliance rule, not defined by DEC.

### Missing Freshness

- If observedAt is missing, the evidence does not conform to DEC (freshness is required). Consumers may reject or treat confidence as zero.
- If expiresAt and ttl are both missing, the consumer cannot infer staleness from the contract alone. Intelligence may use a default policy (e.g. treat as valid for a platform-defined window) or treat as “unknown freshness.”

---

## Summary Table

| Topic | Responsibility | DEC requirement |
|-------|----------------|------------------|
| **Confidence per evidence** | Data engine assigns; intelligence consumes | Required; range [0.0, 1.0]. |
| **Confidence aggregation** | Intelligence | Not defined by DEC. |
| **Missing evidence** | Intelligence | Bundle completeness and count signal absence; behavior is intelligence’s. |
| **Partial evidence** | Intelligence | completeness = partial; downgrade behavior is intelligence’s. |
| **trustScore** | Trust engine (when wired) | Optional field on Evidence; no wiring in DEC. |
| **Freshness (observedAt, expiresAt/ttl)** | Data engine sets; intelligence uses | Required freshness object; staleness policy is intelligence’s. |
| **Stale evidence** | Intelligence | Downgrade or ignore using freshness; exact policy not in DEC. |

This contract ensures that confidence and freshness are first-class attributes of evidence, so that evaluation, explainability, trust, and certification can rely on them without interpreting raw payloads.
