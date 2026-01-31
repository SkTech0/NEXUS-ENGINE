# Integration Guidelines

This document describes how engine-data should conceptually emit EvidenceBundles, how engine-intelligence should conceptually consume them, what is explicitly out of scope, and how the Data Evidence Contract (DEC) enables future explainability, certification, and optimization. No runtime wiring, adapters, or HTTP calls are introduced or specified here.

---

## How Engine-Data Should Emit EvidenceBundles (Conceptually)

1. **Query → Evidence, not raw results.** When a consumer (e.g. intelligence, gateway, or future orchestrator) requests data for a given query and subject, engine-data should:
   - Execute the query against its pipelines, indexes, and storage.
   - Map each result to the canonical **Evidence** model (id, type, subject, payload, confidence, freshness, source, optional trustScore, constraints, tags).
   - Assign **EvidenceType** (FACT, SIGNAL, AGGREGATE, DERIVED, EXTERNAL, or MODEL_OUTPUT) according to the origin of the data.
   - Set **confidence** and **freshness** (observedAt; expiresAt or ttl) per item.
   - Populate **source** (engine, pipeline, index, version) for provenance.
   - Wrap the evidence list in an **EvidenceBundle** with queryId, evidence, count, completeness (complete | partial | failed), and optionally determinismHash.

2. **No raw payloads across the boundary.** Engine-data must not return bare document lists, key-value blobs, or unstructured result sets to engine-intelligence. The only supplied shape is EvidenceBundle (containing Evidence items). Internal storage and API formats may remain unchanged; the contract applies at the boundary where data is consumed by intelligence.

3. **Completeness and determinism.** Engine-data must set bundle completeness from its execution outcome (e.g. complete if all results returned, partial if limit or timeout, failed if error). If reproducibility is required, it should compute and attach determinismHash.

---

## How Engine-Intelligence Should Consume EvidenceBundles (Conceptually)

1. **Request evidence by query and subject.** Intelligence (or an intermediary) requests evidence for a given queryId and subject (entityType, entityId). It receives an EvidenceBundle. It does not assume raw arrays or product-specific schemas.

2. **Respect completeness.** If completeness is partial or failed, intelligence should not treat the bundle as a full picture. It may downgrade outcome confidence, return “insufficient evidence,” or trigger retry according to its own policy.

3. **Use type, confidence, and freshness.** Intelligence should reason differently over FACT, SIGNAL, AGGREGATE, DERIVED, EXTERNAL, and MODEL_OUTPUT as described in [evidence-types.md](./evidence-types.md). It should weight or filter by confidence and apply a staleness policy using freshness (see [confidence-and-freshness.md](./confidence-and-freshness.md)).

4. **Cite evidence for explainability.** When producing an outcome, intelligence should be able to cite which evidence items contributed (id, type, subject, source). DEC does not define the explainability format; it ensures evidence carries the attributes needed for citation.

5. **Do not depend on payload schema.** Intelligence may interpret payload in the context of type and subject, but it must not hard-code product-specific schemas in the contract. Evolution of payload shape is a product concern; the Evidence envelope remains stable.

---

## Explicitly Out of Scope

The following are **not** part of DEC and must not be introduced by this contract:

- **Wiring:** No code, service calls, or RPC that connect engine-data to engine-intelligence. No adapters, clients, or server endpoints.
- **HTTP or transport:** No API paths, request/response formats, or protocol bindings. DEC is a domain contract; transport is a separate layer.
- **Databases and infra:** No new databases, caches, or infrastructure. DEC describes the shape of evidence and bundles only.
- **Product logic:** No loan, fraud, hiring, or other product-specific schemas or enums in the contract. Evidence types and subject entityType/entityId are generic.
- **Trust implementation:** Trust engine interaction is conceptual (trustScore field, downgrade semantics). No actual call to engine-trust or implementation of trust computation.

Implementations that later add wiring, APIs, or storage must conform to DEC at the boundary; they are not defined or required by this contract.

---

## How This Contract Enables Future Explainability, Certification, and Optimization

| Area | DEC contribution |
|------|-------------------|
| **Explainability** | Every evidence item has id, type, subject, source, confidence, and freshness. Explainability layers can cite “which evidence supported this conclusion,” “from which pipeline/index,” and “how old it was.” No need to reverse-engineer raw data. |
| **Certification** | Evidence and bundles are versioned and documented. Auditors can require “decisions only on evidence conforming to DEC” and “bundle completeness and determinismHash for reproducibility.” The contract is the basis for certification criteria. |
| **Optimization** | Optimization and tuning can reason over evidence types and confidence (e.g. “improve outcome by requiring higher confidence or fresher FACT evidence”). The contract gives a stable vocabulary for such policies. |
| **Trust** | When engine-trust is wired, trustScore on Evidence provides a hook. Policies can “reject evidence with trustScore below X” or “prefer evidence with trustScore” without changing the Evidence model. |

---

## Contract Authority and Change

This contract is the authoritative specification for the Data Evidence Contract in NEXUS. Implementations that cross the data–intelligence boundary with evidence must conform to it. Changes to the Evidence model, EvidenceType, EvidenceBundle, or confidence/freshness semantics require a contract change and should follow platform change control so that engine-data and engine-intelligence remain aligned.
