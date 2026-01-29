# Immutable Logs

## Purpose

Define requirements for immutable audit logs for NEXUS-ENGINE. Additive; no change to engine behavior.

## Principles

- Append-only: audit log is append-only; no update or delete of existing records.
- Tamper-evident: integrity protected (e.g., hashing, signing) so tampering is detectable.
- Retention: logs retained per policy; disposal is controlled and documented.

## Implementation (Platform-Level)

| Requirement | Description |
|-------------|-------------|
| Storage | Logs stored in append-only store (e.g., WAL, immutable blob). |
| Integrity | Hash chain or per-record signature; verification possible. |
| Access | Write: audit sink only; read: authorized roles only. |
| Retention | Retention period and secure deletion per compliance. |

## Engine Support

- Engine emits audit events to a sink; it does not implement storage or integrity.
- Event payload includes all fields needed for lineage and verification (see audit-model, decision-lineage).
- No engine logic or API changes required; immutability is platform responsibility.

## Certification Readiness

- Immutable log requirements documented; implementation is platform-specific.
- No engine logic or API changes required.
