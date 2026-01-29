# Log Mapping

## Definition

This document defines how ECOL events and state can be represented in structured logs for correlation with existing logging—without altering engine or logging behavior. ECOL does not replace logging; it defines optional log structures when cognitive events are also written to logs.

## Principle

- ECOL is not logging. Logging remains unchanged.
- When instrumentation emits ECOL events, they may optionally be written to logs in a consistent structure so that log aggregators can index and correlate.
- Log mapping is optional; primary ECOL storage may be separate (e.g. trace store, graph store).

## Structured Log Schema (ECOL Event)

When an ECOL event is written to a log, use a consistent structure:

```json
{
  "timestamp": "ISO8601",
  "level": "info",
  "message": "optional human-readable",
  "ecol": {
    "event_type": "reasoning_step | decision | state_transition | failure | recovery | confidence | trust",
    "trace_id": "string",
    "ref": "step_id | decision_id | failure_id | ...",
    "domain": "string",
    "component": "string",
    "payload": { ... }
  },
  "trace_id": "optional platform trace id",
  "span_id": "optional span id"
}
```

**Rule**: ECOL-specific content is under the "ecol" key so that log pipelines can route, index, or suppress ECOL logs without affecting other log fields.

## Event Type → Log Payload

| ecol.event_type | payload (minimal) |
|-----------------|-------------------|
| reasoning_step | step_id, reasoning_type, input_refs, output_ref, confidence |
| decision | decision_id, decision_type, outcome_ref, branch_taken |
| state_transition | entity_ref, from_state, to_state, trigger_ref |
| failure | failure_id, failure_type, ref, message |
| recovery | recovery_id, action_type, target_ref, outcome |
| confidence | ref_id, confidence, source |
| trust | ref_id, trust_score, ref_type |

**Rule**: payload is a subset of the full ECOL schema for the event; full payload may be in ECOL storage; log is for correlation and search.

## Correlation with Traces

- **trace_id**: Log entry should include trace_id (at top level or in ecol) so that logs can be grouped with OTEL trace or ECOL trace.
- **span_id**: When OTEL is used, span_id in log allows log-to-span correlation.
- **ref**: ecol.ref (step_id, decision_id, etc.) allows log-to-ECOL-entity correlation.

## Propagation Rules

1. **No log requirement**: ECOL does not require events to be logged; this mapping applies only when instrumentation writes ECOL events to logs.
2. **Additive**: Log mapping adds ecol.* structure; it does not change existing log format or levels for non-ECOL logs.
3. **PII/sensitivity**: payload may contain refs only (no PII); full content in ECOL storage; log policy may redact or omit payload.

## Contract

- Log mapping is declarative; implementation of log emission is in instrumentation or logging adapter.
- Engine and existing log calls are unchanged; ECOL log entries are emitted at ECOL hook points only.
