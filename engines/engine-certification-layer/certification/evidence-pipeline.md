# Evidence Pipeline

## Purpose

Define the evidence pipeline for NEXUS-ENGINE: how evidence is generated, collected, stored, and used for certification and compliance. Additive; no change to engine behavior.

## Principles

- Evidence by design: audit, lineage, and validation produce evidence as part of operation (see audit/evidence-generation).
- Pipeline: collect, store, protect, and present evidence for certification and audit.
- Evidence is immutable and access-controlled where required.

## Evidence Sources

| Source | Description |
|--------|-------------|
| Audit logs | Request, decision, override, config, error events (see audit). |
| Decision lineage | Inputs, model, context, outcome (see audit/decision-lineage). |
| Validation results | Determinism, consistency, correctness (see engine-validation). |
| Test results | Compliance, safety, governance, audit, risk tests (see tests/). |
| Config and policy | Current and historical config and policy snapshots. |
| Access and change logs | Who accessed or changed what, when. |

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| Generate | Engine and platform generate events and artifacts. |
| Collect | Sink and aggregator collect evidence. |
| Store | Evidence stored with retention and integrity (see audit/immutable-logs). |
| Present | Evidence presented for certification, audit, review. |

## Engine Support

- Engine emits audit events and lineage; platform collects and stores them.
- Validation and test suites produce evidence; pipeline ingests results.
- No engine logic or API changes required.

## Certification Readiness

- Evidence pipeline documented; implementation is platform-specific.
- No engine logic or API changes required.
