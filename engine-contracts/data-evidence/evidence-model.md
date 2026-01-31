# Evidence Model

This document defines the canonical **Evidence** object: the unit of information that engine-data may expose to engine-intelligence under the Data Evidence Contract (DEC). Every item supplied across the data–intelligence boundary must conform to this model.

---

## Canonical Evidence Object

Evidence is a structured record with the following fields. All fields listed as required must be present; optional fields may be omitted.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **id** | string | Yes | Unique identifier for this evidence item within the scope of the supplying engine or query. Enables deduplication, citation, and audit trails. |
| **type** | EvidenceType | Yes | Semantic type of the evidence (FACT, SIGNAL, AGGREGATE, DERIVED, EXTERNAL, MODEL_OUTPUT). See [evidence-types.md](./evidence-types.md). |
| **subject** | Subject | Yes | The entity this evidence is about: entityType and entityId. Ensures intelligence can associate evidence with the right decision subject. |
| **payload** | opaque | Yes | The actual content. Schema is not defined by DEC; payload is generic. Consumers interpret payload in the context of type and subject. |
| **confidence** | number [0.0–1.0] | Yes | Data engine’s confidence in this evidence (0.0–1.0). Required so intelligence can weight or filter evidence. |
| **trustScore** | number [0.0–1.0] | No | Optional score from a trust layer. When present, intelligence may use it in addition to confidence. DEC does not define how trust is computed. |
| **freshness** | Freshness | Yes | When the evidence was observed and when it is considered stale. See [confidence-and-freshness.md](./confidence-and-freshness.md). |
| **source** | Source | Yes | Provenance: which engine, pipeline, index, and version produced this evidence. Required for audit and explainability. |
| **constraints** | object or array | No | Optional conditions or boundaries (e.g. applicability, scope). Schema is not fixed by DEC. |
| **tags** | string[] | No | Optional labels for filtering, routing, or categorization. Product-agnostic. |

---

## Field Semantics and Rationale

### id

- **Why it exists:** Enables reference and citation. Explainability and audit need to point to specific evidence items; deduplication and idempotency need a stable key.
- **Constraints:** Must be unique within the evidence set supplied for a given request or bundle. Format is not prescribed (UUID, composite key, or engine-specific id are acceptable).

### type

- **Why it exists:** Intelligence must reason differently over facts, signals, aggregates, derived values, external claims, and model outputs. Type drives weighting, staleness policy, and citation style.
- **Semantics:** See [evidence-types.md](./evidence-types.md).

### subject

- **Why it exists:** Evidence is always *about* something (an applicant, a transaction, a tenant). Subject binds evidence to the entity under evaluation so intelligence does not mix evidence across subjects.
- **Structure:**
  - **entityType:** string. Kind of entity (e.g. "applicant", "transaction"). Values are not enumerated by DEC.
  - **entityId:** string. Stable identifier for that entity in the supplying system.

### payload

- **Why it exists:** The actual information (facts, counts, vectors, labels). DEC does not define schema so that the contract remains product-agnostic and reusable.
- **Constraint:** Must be serializable and non-empty for the evidence to be meaningful. Interpretation is the consumer’s responsibility in the context of type and subject.

### confidence

- **Why it exists:** Not all evidence is equally reliable. Confidence allows intelligence to weight evidence, apply thresholds, and explain why some evidence was discounted.
- **Range:** 0.0 (no confidence) to 1.0 (full confidence). Required. See [confidence-and-freshness.md](./confidence-and-freshness.md) for propagation and use.

### trustScore

- **Why it exists:** Optional integration point with a trust engine. When present, it represents an external or cross-cutting assessment of trustworthiness. DEC does not define computation or wiring.

### freshness

- **Why it exists:** Evidence ages. Intelligence must know when it was observed and when it expires so it can downgrade or ignore stale data.
- **Structure:**
  - **observedAt:** timestamp (ISO 8601 or epoch). When the evidence was produced or last validated.
  - **expiresAt:** timestamp (optional). When the evidence is considered stale.
  - **ttl:** duration (optional). Alternative to expiresAt; time-to-live from observedAt.

### source

- **Why it exists:** Audit, certification, and explainability require provenance. Source answers: *Which engine, pipeline, index, and version produced this?*
- **Structure:**
  - **engine:** string. Identifier of the supplying engine (e.g. "engine-data").
  - **pipeline:** string (optional). Pipeline or flow that produced the evidence.
  - **index:** string (optional). Index or store that was queried.
  - **version:** string (optional). Schema or contract version for reproducibility.

### constraints

- **Why it exists:** Some evidence is conditional (e.g. only valid in a region, only for a product). Optional; schema is not fixed so products can attach scope or applicability without extending the core contract.

### tags

- **Why it exists:** Filtering, routing, and categorization without encoding product logic in the core model. Optional; values are not enumerated by DEC.

---

## Conformance

Implementations that emit evidence to engine-intelligence (or to any consumer under DEC) must produce objects that satisfy the Evidence model: required fields present, types and ranges as specified. Consumers may reject or downgrade evidence that does not conform. DEC does not define wire format (JSON, etc.); that belongs to integration or API layers, which are out of scope for this contract.
