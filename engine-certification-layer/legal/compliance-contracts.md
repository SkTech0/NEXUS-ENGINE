# Compliance Contracts

## Purpose

Define how NEXUS-ENGINE aligns with compliance contracts: DPAs, BAAs, SCCs, and other contractual compliance instruments. Additive; no change to engine behavior.

## Principles

- Compliance contracts are at organization and deployment level; engine is a processing component.
- Engine design supports data protection, audit, and retention so that contract obligations can be met.
- Cross-border and sectoral contracts (GDPR, HIPAA, PCI-DSS) are documented in compliance layer.

## Contract Types

| Type | Description | Engine Relevance |
|------|-------------|------------------|
| DPA | Data processing agreement (e.g., GDPR Art. 28) | Processor obligations; engine supports audit, retention, security. |
| BAA | Business associate agreement (HIPAA) | BA obligations; engine supports safeguards and audit. |
| SCCs | Standard contractual clauses (transfer) | Processing and security; see compliance/cross-border. |
| Commercial | License, SLA, liability, warranty | See sla-model, liability-boundaries, warranty-model. |

## Engine Support

- Engine does not sign or implement contracts; design supports processor/BA obligations (access control, audit, encryption, retention).
- Compliance documentation (compliance/) and legal artifacts (legal/) provide contract-ready evidence and descriptions.
- No engine logic or API changes required.

## Certification Readiness

- Compliance contract alignment documented; execution is organization-specific.
- No engine logic or API changes required.
