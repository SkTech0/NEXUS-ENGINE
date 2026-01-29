# Traceability

## Purpose

Define traceability for NEXUS-ENGINE: trace chains from request to decision to evidence. Additive; no change to engine behavior.

## Principles

- End-to-end trace: every decision can be traced back to request, inputs, model, and context.
- Trace chains are stored in audit log and support decision lineage (see decision-lineage).
- Trace IDs are stable and linkable across systems (request ID, decision ID, span ID).

## Trace Elements

| Element | Description |
|---------|-------------|
| Request ID | Unique ID for each request; propagated through engine. |
| Decision ID | Unique ID for each decision or inference. |
| Span ID | Optional; for distributed tracing across services. |
| Model ref | Model ID and version used. |
| Input refs | References to input data (no PII in log if required). |
| Lineage | Links to prior decisions or state if applicable. |

## Engine Support

- Engine assigns and propagates request ID and decision ID; emits them in audit events.
- Decision lineage links decision to inputs, model, and context (see decision-lineage).
- Integration with distributed tracing (e.g., OpenTelemetry) is platform-level.

## Certification Readiness

- Traceability model documented; implementation is platform-specific.
- No engine logic or API changes required; design supports full trace.
