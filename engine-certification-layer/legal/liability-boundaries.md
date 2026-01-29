# Liability Boundaries

## Purpose

Define liability boundaries for NEXUS-ENGINE: what is in and out of scope for liability. Additive; no change to engine behavior.

## Principles

- Liability is defined at organization and contract level; engine is a component.
- Boundaries are documented so that procurement and legal can assess risk.
- Engine design supports traceability and accountability to support liability allocation.

## Boundary Types

| Boundary | Description |
|----------|-------------|
| Scope | What the engine does and does not do; what is supported vs. unsupported use. |
| Integration | Engine vs. integrating system; who is responsible for integration correctness. |
| Data | Engine does not own data; data owner and processor responsibilities (see compliance). |
| Third-party | Dependencies, models, and services; pass-through or allocation of liability. |

## Engine Support

- Engine is provided as component; liability for deployment and use is with operator/licensee unless contract states otherwise.
- Audit, lineage, and explainability support dispute resolution and accountability (see audit, governance).
- No engine logic or API changes required; boundaries are contractual and documented.

## Certification Readiness

- Liability boundaries documented; allocation is contract-specific.
- No engine logic or API changes required.
