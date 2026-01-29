# Execution Trace Model

## Definition

An **execution trace** is the record of execution spans (units of work) and their timing and parent-child relationships. It supports performance analysis and correlation with cognitive traces—without altering execution logic.

## Execution Trace Schema (Cognitive View)

ECOL does not replace distributed tracing; it defines how cognitive observability **maps onto** execution traces. Schema below is the cognitive overlay.

```yaml
trace_id: string (aligns with OTEL or platform trace_id)
trace_type: "execution"

# Spans (conceptually; actual span format may be OTEL)
spans: list of:
  span_id: string
  parent_span_id: string | null
  name: string
  start_time: ISO8601
  end_time: ISO8601 | null
  attributes: map

  # Cognitive overlay (additive)
  cognitive_ref: string | null  # step_id, decision_id, or flow_id
  cognitive_type: enum [reasoning | decision | inference | data_flow] | null
  domain: string | null
```

## Cognitive Overlay Rules

1. **cognitive_ref**: When a span corresponds to a reasoning step, decision, inference flow, or data flow stage, cognitive_ref links to that entity (step_id, decision_id, flow_id, stage_id).
2. **cognitive_type**: Indicates which cognitive model the span aligns with.
3. **No new spans required**: Overlay is additive attributes on existing spans; no requirement to create new spans for ECOL.

## Relationship to OTEL

- trace_id and span_id should align with OpenTelemetry TraceId and SpanId where the platform uses OTEL (see integration/otel-mapping.md).
- Execution trace is the runtime view; reasoning and decision traces are the cognitive view. Same trace_id links them.

## Propagation Rules

1. **Parent-child**: parent_span_id defines the span tree; cognitive_ref can be set on any span that performs cognitive work.
2. **Correlation**: Query by trace_id to get both execution spans and cognitive refs for full picture.

## Contract

- Execution trace is typically produced by the existing tracing infrastructure; ECOL adds cognitive_ref and cognitive_type where instrumentation hooks are placed.
- No change to execution paths; overlay is additive.
