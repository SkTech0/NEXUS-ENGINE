# Audit Tests

## Purpose

Define test specifications for audit-related verification of NEXUS-ENGINE. Additive; no change to engine behavior. Tests are specifications; implementation is platform or test-suite specific.

## Scope

- Verification that engine produces immutable-capable audit events, trace chains, decision lineage, and evidence (see audit/).
- Tests verify event content and structure; they do not implement storage or integrity.

## Test Categories

| Category | Description |
|----------|-------------|
| Audit events | Verify that every request, decision, override, config change, and error produces an audit event with required fields (request ID, decision ID, actor, timestamp, context). |
| Traceability | Verify that request ID and decision ID are stable and propagated; trace chain is complete. |
| Lineage | Verify that decision lineage includes inputs ref, model ref, output, confidence (if applicable), timestamp, actor. |
| Immutability | Verify that audit sink is append-only and integrity-protected (platform-level). |
| Forensic | Verify that evidence (audit, lineage, snapshot) is available for a given request/decision (platform-level). |

## Evidence

- Test results (pass/fail, coverage) are stored and available for certification (see certification/evidence-pipeline).
- Audit test specifications documented; implementation is test-suite and platform specific.
- No engine logic or API changes required beyond existing audit emission.

## Certification Readiness

- Audit test specifications documented; implementation is test-suite specific.
- No engine logic or API changes required.
