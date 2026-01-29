# Abuse Scenarios

## Purpose

Define abuse scenarios for NEXUS-ENGINE: deliberate misuse or adversarial abuse and mitigations. Additive; no change to engine behavior.

## Principles

- Abuse is deliberate misuse or attack; scenarios are documented and mitigated (see safety/abuse-prevention).
- Adversarial scenarios (see adversarial-model) are a subset of abuse.
- Mitigations: authentication, authorization, audit, resilience, validation.

## Abuse Scenarios

| Scenario | Description | Mitigation |
|----------|-------------|------------|
| Adversarial input | Input crafted to skew or break decisions | Validation, bounds, monitoring, fallback |
| Unauthorized access | Attacker gains API or admin access | IAM, RBAC, MFA, audit |
| Denial of service | Attacker exhausts capacity or triggers failure | Rate limits, circuit breakers, resilience |
| Reputation attack | Attacker manipulates outputs to harm trust | Audit, lineage, explainability |
| Data poisoning | Attacker corrupts training or reference data | Data governance, validation, versioning |
| Model extraction | Attacker infers model via queries | Rate limits, access control, monitoring |

## Engine Support

- Engine does not implement security controls; platform enforces authentication and authorization.
- Engine supports validation, bounds, and fallback (see engine-validation, safety).
- Audit and lineage support detection and attribution (see audit).

## Certification Readiness

- Abuse scenarios documented; mitigations in risk and safety layers.
- No engine logic or API changes required.
