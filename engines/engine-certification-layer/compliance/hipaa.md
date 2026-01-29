# HIPAA Readiness

## Purpose

Prepare NEXUS-ENGINE for use in contexts requiring HIPAA (Health Insurance Portability and Accountability Act) alignment when processing protected health information (PHI). Additive; no change to engine behavior.

## Scope

- Administrative, physical, and technical safeguards as they apply to the engine.
- Engine as component of a system that may create, receive, maintain, or transmit PHI.
- BAA (Business Associate Agreement) and policy alignment; engine does not store PHI by default; PHI handling is integration responsibility.

## Safeguards Alignment

| Safeguard | Engine Relevance | Readiness |
|-----------|------------------|-----------|
| Administrative | Policies, workforce security, access management, evaluation | Documented at org/layer |
| Physical | N/A for engine software; applies to hosting | Hosting provider |
| Technical | Access control, audit, integrity, transmission security | Documented |

## Technical Safeguards (Engine)

- **Access control**: Unique user identification, automatic logoff, encryption (see enterprise IAM, encryption).
- **Audit controls**: Immutable logs, traceability, decision lineage (see audit).
- **Integrity**: Validation, checksums, non-repudiation where applicable (see engine-validation).
- **Transmission security**: TLS, encryption in transit (see network, secrets).
- **Authentication**: Integration with enterprise IAM/SSO (see enterprise).

## PHI Handling

- Engine does not require PHI in core decision logic; PHI may be passed at integration boundary.
- Minimisation: design supports de-identification and tokenisation at data layer.
- Retention and disposal: configurable; evidence and procedures documented at platform level.

## Certification Readiness

- HIPAA alignment documented for engine as processing component.
- Formal compliance is organization and deployment-specific; BAA and policies at org level.
- No engine logic or API changes required.
