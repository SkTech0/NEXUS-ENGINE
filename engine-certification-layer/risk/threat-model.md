# Threat Model

## Purpose

Define the threat model for NEXUS-ENGINE: threats, assets, and mitigations. Additive; no change to engine behavior.

## Principles

- Threat model covers engine and its integration boundaries.
- Assets: engine state, models, data in use, audit logs, credentials.
- Threats: unauthorized access, tampering, denial of service, data exfiltration, abuse.

## Assets

| Asset | Sensitivity | Mitigation |
|-------|-------------|------------|
| Engine state | High | Access control, encryption, audit |
| Models | High | Access control, versioning, audit |
| Data in use | Per classification | Access, encryption, retention |
| Audit logs | High | Immutable, access control, integrity |
| Credentials | Critical | Secrets management, rotation |

## Threats and Mitigations

| Threat | Mitigation |
|--------|------------|
| Unauthorized API access | IAM, RBAC, authentication (see enterprise). |
| Tampering with state or model | Access control, integrity checks, audit. |
| Denial of service | Rate limits, resilience, circuit breakers (see engine-resilience-layer). |
| Data exfiltration | Data governance, access control, audit. |
| Adversarial input | Validation, bounds, monitoring (see adversarial-model). |

## Certification Readiness

- Threat model documented; mitigations in place via governance, resilience, audit.
- No engine logic or API changes required.
