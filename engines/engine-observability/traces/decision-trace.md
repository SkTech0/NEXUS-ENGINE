# Decision Trace Model

## Definition

A **decision trace** is the ordered record of decisions and their outcomes within a single cognitive run. It supports audit, replay, and explanation of how a final outcome was reached.

## Decision Trace Schema

```yaml
trace_id: string (opaque, unique)
trace_type: "decision"
started_at: ISO8601
ended_at: ISO8601 | null

trigger_ref: string | null
domain: string
component: string

# Content
decisions: list of decision flow entries (see flows/decision-flow.md)
  - decision_id, sequence, timestamp, decision_type, input_refs, outcome_ref, branch_taken, parent_decision_id, child_decision_ids

# Aggregates
decision_count: integer
final_outcome_ref: string  # outcome of root or last decision
decision_graph_ref: string | null
reasoning_trace_ref: string | null  # link to reasoning trace for same run
```

## Structural Constraints

1. **Ordering**: decisions are ordered by sequence.
2. **Hierarchy**: parent_decision_id and child_decision_ids form a tree; root has parent_decision_id = null.
3. **Final outcome**: final_outcome_ref is the outcome_ref of the root decision or the last decision in the flow (policy-dependent).

## Relationship to Other Traces

- **Reasoning trace**: reasoning_trace_ref links to the reasoning steps that fed these decisions; same run has same logical trace_id in correlation.
- **Execution trace**: execution trace has spans; decision trace is logical and can be mapped to spans (see integration/trace-mapping.md).
- **Decision graph**: decision_graph_ref points to the full graph (inputs, reasoning, decisions, outputs).

## Propagation Rules

1. **Immutable**: Once emitted, decision trace is append-only.
2. **Correlation**: trace_id correlates with reasoning_trace, execution_trace, and OTEL trace_id where applicable.

## Contract

- Decision traces are produced at instrumentation boundaries when decisions are made.
- Additive only; no change to decision logic.
