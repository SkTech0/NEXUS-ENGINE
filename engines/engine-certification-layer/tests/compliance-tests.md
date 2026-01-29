# Compliance Tests

## Purpose

Define test specifications for compliance-related verification of NEXUS-ENGINE. Additive; no change to engine behavior. Tests are specifications; implementation is platform or test-suite specific.

## Scope

- Verification that engine behavior and design support compliance objectives (ISO 27001, SOC 2, GDPR, HIPAA, PCI-DSS, AI governance, data protection, cross-border).
- Tests do not certify compliance; they provide evidence of control operation and design support.

## Test Categories

| Category | Description |
|----------|-------------|
| Access control | Verify that only authenticated and authorized requests are processed; audit events include actor. |
| Audit | Verify that every significant action and decision produces an audit event with required fields. |
| Data handling | Verify that data handling (retention, purge, classification) is configurable and auditable. |
| Encryption | Verify that sensitive data at rest and in transit is protected per configuration. |
| Retention | Verify that retention and disposal are configurable and evidenced. |
| Cross-border | Verify that data residency and transfer controls are configurable (deployment-level). |

## Evidence

- Test results (pass/fail, coverage) are stored and available for compliance and certification (see certification/evidence-pipeline).
- Tests are repeatable and documented; no engine logic or API changes required for compliance tests beyond existing audit and validation.

## Certification Readiness

- Compliance test specifications documented; implementation is test-suite specific.
- No engine logic or API changes required.
