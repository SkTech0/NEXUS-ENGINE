# Data Evidence Contract (DEC)

## Purpose

The **Data Evidence Contract (DEC)** is a domain contract that defines how engine-data exposes information to engine-intelligence. It specifies the shape, semantics, and guarantees of *evidence*—structured, attributed, and time-bound information—that data may supply to reasoning without coupling the two engines at runtime.

DEC exists so that:

1. **Integration is safe.** When engine-data and engine-intelligence are eventually wired, they exchange evidence bundles, not raw records. Evidence carries provenance, confidence, and freshness so intelligence can reason and explain without re-interpreting raw data semantics.

2. **Engines stay decoupled.** Engine-data owns pipelines, indexing, storage, and caching. Engine-intelligence owns evaluation, confidence, and outcomes. DEC is the boundary: data *emits* evidence; intelligence *consumes* evidence. No shared schemas, no direct calls, no product-specific types in the contract.

3. **Trust and explainability are possible.** Every evidence item has a type, subject, source metadata, confidence, and freshness. Auditors and explainability layers can answer: *What was considered? From where? How old? How certain?* DEC is the foundation for certification and audit trails.

4. **The platform remains enterprise-grade.** Regulated and high-assurance use cases require clear attribution, staleness handling, and deterministic reasoning over known evidence. DEC defines the evidence model that supports those requirements.

---

## Why Engine-Data Must Not Return Raw Data to Engine-Intelligence

Returning raw query results (e.g. document lists, key-value blobs) from engine-data to engine-intelligence would:

- **Blur ownership.** Intelligence would have to interpret schema, keys, and semantics defined by data, creating hidden coupling and making it unclear who is responsible for correctness and evolution.

- **Undermine explainability.** Raw data does not carry confidence, freshness, or source. An evaluator could not justify *why* it trusted or discounted a given fact, or whether it was stale.

- **Block trust and certification.** Trust and certification layers need a stable, typed notion of *evidence*—what was supplied, from which pipeline or index, with what confidence and expiry. Raw payloads do not satisfy that.

- **Prevent safe evolution.** Changing data schemas or indexing would risk breaking intelligence. A formal evidence contract allows both sides to evolve within the contract; evidence types and bundles version explicitly.

DEC therefore requires that engine-data *never* exposes raw data to engine-intelligence. It exposes **Evidence** and **EvidenceBundles** only: canonical structures defined in this contract, with required fields for subject, type, confidence, freshness, and source.

---

## How DEC Enables Decoupling, Trust, Explainability, and Enterprise Readiness

| Concern | DEC contribution |
|--------|-------------------|
| **Decoupling** | Evidence and bundles are engine-agnostic. Data emits; intelligence consumes. No product schemas (loan, fraud, hiring) in the contract. Implementation and wiring are out of scope. |
| **Trust** | Every evidence item has source metadata (engine, pipeline, index, version), optional trust score, and confidence. Trust engine (when wired) can reason over evidence attributes without interpreting payloads. |
| **Explainability** | Evidence type, subject, and freshness are explicit. Explainability layers can cite *which* evidence supported or contradicted a conclusion and how old it was. |
| **Enterprise readiness** | Contract is versioned, documented, and auditable. Confidence and freshness support compliance (e.g. “decisions only on evidence not older than X”). Determinism and completeness signals in bundles support reproducibility. |

---

## Scope of This Contract

- **In scope:** Definition of Evidence, EvidenceType, EvidenceBundle, confidence and freshness semantics, and integration guidelines at the *domain* level. Use of this contract for future explainability, certification, and optimization.

- **Out of scope:** Runtime wiring, HTTP APIs, adapters, service calls, databases, and any implementation that connects engine-data to engine-intelligence. This contract is specification only; no code or infrastructure is introduced here.

---

## Document Index

| Document | Content |
|----------|---------|
| [evidence-model.md](./evidence-model.md) | Canonical Evidence object: fields, semantics, and rationale. |
| [evidence-types.md](./evidence-types.md) | EvidenceType enum (FACT, SIGNAL, AGGREGATE, DERIVED, EXTERNAL, MODEL_OUTPUT) and how intelligence should treat each. |
| [evidence-bundle.md](./evidence-bundle.md) | EvidenceBundle: queryId, evidence array, count, completeness, determinismHash. |
| [confidence-and-freshness.md](./confidence-and-freshness.md) | Confidence propagation, staleness, partial data, and conceptual interaction with Trust. |
| [integration-guidelines.md](./integration-guidelines.md) | How data emits and intelligence consumes evidence; out-of-scope items; link to explainability and certification. |
| [validation-engine-intelligence.md](./validation-engine-intelligence.md) | DEC validation report for engine-intelligence internals: alignment, gaps, and recommendations. |

---

## Audience

This contract is for platform architects, engine owners, and auditors. It is the authoritative reference for the Data Evidence Contract in NEXUS. Implementations (when added) must conform to DEC; changes to DEC follow platform change control.
