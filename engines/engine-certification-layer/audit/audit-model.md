# Audit Model

## Purpose

Define the audit model for NEXUS-ENGINE: what is logged, how, and for how long. Additive; no change to engine behavior.

## Principles

- Auditability by default: every significant action and decision is logged.
- Immutable logs: audit records are append-only and tamper-evident (see immutable-logs).
- Traceability: logs support trace chains and decision lineage (see traceability, decision-lineage).
- Accountability: every record includes actor, timestamp, and context.

## Audit Events (Engine)

| Event Type | When | Contents |
|------------|------|----------|
| Request | Every API request | Request ID, actor, timestamp, scope, model ref. |
| Decision | Every decision or inference | Decision ID, inputs ref, outputs, model, confidence, lineage. |
| Override | Every override or fallback | Override reason, actor, timestamp, original and override outcome. |
| Config change | Every configuration change | Actor, timestamp, before/after, approval ref if applicable. |
| Error | Every failure or boundary violation | Error type, context, stack ref, recovery action. |

## Retention and Access

- Retention: configurable; minimum per compliance (see compliance).
- Access: audit logs are access-controlled; read-only for auditors and compliance.
- Integrity: logs are immutable and optionally checksummed or signed (see immutable-logs).

## Certification Readiness

- Audit model documented; implementation is platform-specific.
- No engine logic or API changes required; engine emits audit events.
