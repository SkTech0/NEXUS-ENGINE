# Decision Lineage

## Purpose

Define decision lineage for NEXUS-ENGINE: how each decision is linked to inputs, model, and evidence. Additive; no change to engine behavior.

## Principles

- Every decision has lineage: inputs, model version, context, and optional prior state.
- Lineage supports explainability (see engine-explainability) and audit (see audit).
- Lineage is stored in audit and is immutable once written.

## Lineage Contents

| Field | Description |
|-------|-------------|
| Decision ID | Unique identifier. |
| Request ID | Parent request. |
| Model ID / version | Model used. |
| Input refs / hashes | References or hashes of inputs (no PII if required). |
| Output / outcome | Decision or inference result. |
| Confidence / scores | If applicable. |
| Sub-decisions or steps | If decision is composite. |
| Timestamp, actor | When and by whom (system or user). |

## Engine Support

- Engine produces lineage payload for every decision; sink stores it (see audit).
- Explainability layer adds human-readable rationale and confidence (see engine-explainability).
- Replay and validation use lineage for reproducibility (see engine-validation).

## Certification Readiness

- Decision lineage documented; storage and format are platform-specific.
- No engine logic or API changes required; engine emits lineage.
