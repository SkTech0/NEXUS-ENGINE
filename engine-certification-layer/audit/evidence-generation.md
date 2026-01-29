# Evidence Generation

## Purpose

Define evidence generation for NEXUS-ENGINE: what evidence the engine and platform produce for audits and certifications. Additive; no change to engine behavior.

## Principles

- Evidence by design: audit, lineage, and compliance artifacts are generated as part of operation.
- Evidence is structured: machine-readable where needed for certification pipelines (see certification/evidence-pipeline).
- Evidence is attributable: linked to request, decision, and actor.

## Evidence Artifacts

| Artifact | Source | Use |
|----------|--------|-----|
| Audit records | Engine + platform | SOC 2, ISO 27001, forensic |
| Decision lineage | Engine | Explainability, audit, dispute |
| Compliance snapshots | Platform | Compliance status, certification |
| Access and config logs | Platform | Access governance, change audit |
| Test and validation results | Engine-validation, tests | Safety, correctness, certification |

## Engine Support

- Engine produces audit events and lineage; platform aggregates and stores evidence.
- Validation and test suites produce evidence of correctness and determinism (see engine-validation).
- No engine logic or API changes required; evidence generation is part of existing audit and validation.

## Certification Readiness

- Evidence generation documented; pipelines in certification layer.
- No engine logic or API changes required.
