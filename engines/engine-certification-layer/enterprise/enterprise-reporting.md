# Enterprise Reporting

## Purpose

Define enterprise reporting for NEXUS-ENGINE: reports for compliance, certification, and operations. Additive; no change to engine behavior.

## Principles

- Reporting consumes audit, metrics, and evidence; engine does not produce reports directly.
- Reports support certification, compliance, SLA, and management review (see reports/).
- Format and frequency are enterprise-specific.

## Report Types

| Type | Description |
|------|-------------|
| Certification readiness | Status against certification criteria (see reports/certification-readiness). |
| Compliance status | Status against regulations and standards (see reports/compliance-status). |
| Audit status | Audit coverage, findings, remediation (see reports/audit-status). |
| Safety status | Safety controls and incidents (see reports/safety-status). |
| Enterprise readiness | IAM, SSO, RBAC, logging, monitoring (see reports/enterprise-readiness). |
| SLA | Availability, performance, incidents (see legal/sla-model). |

## Engine Support

- Engine produces data for reports (audit events, metrics, validation results); reporting layer aggregates and formats.
- No engine logic or API changes required; reporting is platform and process.

## Certification Readiness

- Enterprise reporting documented; report definitions in reports/.
- No engine logic or API changes required.
