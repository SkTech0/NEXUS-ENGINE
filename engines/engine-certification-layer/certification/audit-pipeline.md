# Audit Pipeline

## Purpose

Define the audit pipeline for NEXUS-ENGINE: how audits are planned, executed, and evidenced. Additive; no change to engine behavior.

## Principles

- Auditability by default: engine emits audit events and lineage; pipeline consumes them (see audit).
- Audit pipeline: scope, evidence collection, review, report, remediation.
- Internal and external audits supported by evidence and documentation.

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| Scope | Define audit scope (engine, platform, processes). |
| Evidence | Collect audit logs, lineage, config, policies (see audit, evidence-pipeline). |
| Review | Auditor reviews evidence and control operation. |
| Report | Audit report and findings. |
| Remediation | Address findings; re-audit if required. |

## Engine Support

- Engine produces audit events and decision lineage; platform stores and protects them (see audit).
- Forensic readiness and evidence generation support audit (see audit/forensic-readiness, evidence-generation).
- No engine logic or API changes required.

## Certification Readiness

- Audit pipeline documented; execution is organization-specific.
- No engine logic or API changes required.
