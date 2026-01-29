# Reasoning Trace Model

## Definition

A **reasoning trace** is the ordered record of reasoning steps that led to one or more conclusions in a single cognitive run. It is the primary structure for tracing how the engine reasoned—without altering reasoning logic.

## Reasoning Trace Schema

```yaml
trace_id: string (opaque, unique)
trace_type: "reasoning"
started_at: ISO8601
ended_at: ISO8601 | null

trigger_ref: string | null
domain: string
component: string

# Content
steps: list of reasoning steps (see cognition/reasoning-model.md)
  - step_id, sequence, timestamp, reasoning_type, input_refs, output_ref, confidence, parent_steps, child_steps

# Aggregates
step_count: integer
conclusion_refs: string[]  # output_refs that are final conclusions
decision_graph_ref: string | null  # link to decision graph built from this trace
```

## Structural Constraints

1. **Ordering**: steps are ordered by sequence; timestamp should be non-decreasing (allow equal for concurrent).
2. **Connectivity**: Every step has parent_steps or is an entry step (no parents); every non-sink step has child_steps.
3. **Conclusion refs**: conclusion_refs are the output_refs of steps that are not consumed by another step in this trace (sink outputs).

## Relationship to Decision Graph

- A reasoning trace can be converted or linked to a decision graph: steps become nodes, parent/child and input_refs become edges.
- decision_graph_ref points to the graph if materialized separately.

## Propagation Rules

1. **Immutable**: Once emitted, a reasoning trace is append-only; steps are not updated or deleted.
2. **Trace ID**: trace_id is the primary key; used for correlation with decision trace, execution trace, and OTEL trace (see integration).

## Contract

- Reasoning traces are produced by the instrumentation layer at the boundaries defined in instrumentation/reasoning-hooks.md.
- No business logic is changed; steps are recorded after reasoning occurs.
