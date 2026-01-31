# Evidence Types

This document defines the **EvidenceType** enumeration and semantics. Every Evidence object must carry one of these types so that engine-intelligence can reason appropriately over each item.

---

## EvidenceType Enumeration

| Type | Description |
|------|-------------|
| **FACT** | Asserted fact: a record, attribute, or state that the data engine treats as true at observation time. |
| **SIGNAL** | Time-bound or event-derived signal (e.g. event, metric, alert). May be ephemeral or high-frequency. |
| **AGGREGATE** | Pre-computed aggregate (count, sum, average, distribution) over a set of records or a time window. |
| **DERIVED** | Value derived by the data engine from other evidence or rules (e.g. computed field, join result). |
| **EXTERNAL** | Information sourced from an external system or third party. Provenance is outside the platform. |
| **MODEL_OUTPUT** | Output of a model (e.g. score, classification) produced by engine-ai or another model-serving component. |

---

## Semantics and Intelligence Handling

### FACT

- **Meaning:** A statement or record the data engine treats as factual at the time of observation (e.g. “applicant employment = X”, “transaction amount = Y”). Not inferred; stored or indexed as given.
- **Intelligence use:** Treat as primary input. Weight by confidence and freshness. Suitable for direct use in rules and evaluation. Staleness should be applied strictly (facts can become wrong over time).

### SIGNAL

- **Meaning:** Time-bound or event-driven information: events, metrics, alerts, or streams. May be volatile or short-lived.
- **Intelligence use:** Use for recency and trend, not as long-term truth. Prefer recent signals; downgrade or ignore expired signals. May combine with FACT for “current state + recent activity.”

### AGGREGATE

- **Meaning:** Summary over many records or a window (counts, sums, averages, histograms). Represents a population or period, not a single entity’s raw state.
- **Intelligence use:** Use for context and distribution (e.g. “how does this compare to the population?”). Do not treat as a single-entity fact without considering scope and window. Staleness depends on refresh policy of the aggregate.

### DERIVED

- **Meaning:** Value computed by the data engine from other data (joins, rules, transforms). Lineage is internal to the data engine.
- **Intelligence use:** Weight by confidence; consider that errors or staleness in upstream evidence propagate. Prefer citing underlying evidence when explaining. May apply stricter confidence discount if derivation chain is long.

### EXTERNAL

- **Meaning:** Data from outside the platform (third-party API, external DB, partner). Source is explicitly external.
- **Intelligence use:** Treat with caution: trust and freshness are unknown unless stated in confidence/freshness. Prefer trustScore when available. Explainability should clearly label evidence as external.

### MODEL_OUTPUT

- **Meaning:** Output of a model (e.g. risk score, classification) produced by engine-ai or another model service. Evidence carries the output, not the raw input to the model.
- **Intelligence use:** Use as a signal or feature, not as ground truth. Confidence may reflect model certainty or validation. Explainability should distinguish “model said X” from “data fact X.” Staleness applies to the model output, not necessarily to the underlying data.

---

## How Intelligence Should Reason Differently

| Concern | FACT | SIGNAL | AGGREGATE | DERIVED | EXTERNAL | MODEL_OUTPUT |
|---------|------|--------|-----------|---------|----------|--------------|
| **Primary use** | Direct input | Recency, trend | Context, distribution | Computed input | Optional input | Feature/signal |
| **Staleness** | Strict | Strict (short TTL) | Per refresh | Depends on inputs | Per source | Per run/version |
| **Confidence** | Use as given | Use; may cap by age | Use; mind scope | May discount by chain | Use with care | Use as model certainty |
| **Explainability** | Cite as fact | Cite as recent signal | Cite scope/window | Cite derivation | Label external | Label as model output |
| **Trust** | Default by source | Default by source | Default by source | Propagate from inputs | Prefer trustScore | Separate from data trust |

---

## Extensibility

DEC defines exactly the six types above. Extensions (e.g. product-specific subtypes) must not change the semantics of these types. If a new top-level type is required for the platform, it must be added via a contract change and documented here. Implementations must not invent new EvidenceType values without a contract update.
