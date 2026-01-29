# Misuse Model

## Purpose

Define the misuse model for NEXUS-ENGINE: unintended or inappropriate use scenarios and mitigations. Additive; no change to engine behavior.

## Principles

- Misuse is use outside intended scope or in violation of policy.
- Misuse model identifies scenarios and mitigations (see safety/misuse-prevention).
- Mitigations: access control, scope limits, audit, validation.

## Misuse Scenarios

| Scenario | Description | Mitigation |
|----------|-------------|------------|
| Use outside approved use case | Engine used for unapproved domain or purpose | Scope configuration, policy, audit |
| Privilege escalation | User gains access beyond role | RBAC, audit, least privilege |
| Data misuse | Data used for wrong purpose or retention violation | Data governance, access, audit |
| Model misuse | Wrong model or version for use case | Model governance, versioning, audit |
| Resource misuse | Excessive load or abuse of capacity | Rate limits, resilience, audit |

## Engine Support

- Engine does not enforce business policy; platform and integration enforce scope and policy.
- Engine emits audit events for every request and decision; misuse is detectable in audit.
- Validation and resilience limit impact of misuse (see engine-validation, engine-resilience-layer).

## Certification Readiness

- Misuse model documented; mitigations in governance and safety.
- No engine logic or API changes required.
