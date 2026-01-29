# Optimization Paths Model

## Definition

**Optimization path** is the sequence of solver steps, constraint evaluations, or objective evaluations that led to a chosen solution. This model defines how optimization paths are represented for cognitive observability—without altering optimization logic.

## Optimization Path Schema

```yaml
path_id: string
trace_id: string
started_at: ISO8601
ended_at: ISO8601 | null

optimization_type: enum [single_objective | multi_objective | constraint_satisfaction]
solver_ref: string | null
objective_refs: string[]
constraint_refs: string[]

# Path (ordered steps)
steps: list of:
  step_id: string
  sequence: integer
  timestamp: ISO8601
  step_type: enum [evaluate | constraint_check | solve | select]
  input_ref: string | null
  output_ref: string | null
  objective_value: float | null
  constraint_slacks: map | null  # constraint_ref -> slack

# Result
selected_point_ref: string  # final chosen solution
frontier_ref: string | null  # if multi-objective, link to frontier
```

## Propagation Rules

1. **Ordering**: steps are ordered by sequence; order reflects solver or evaluation order.
2. **Result binding**: selected_point_ref is the final solution; frontier_ref links to decision-frontier.md when applicable.
3. **Trace binding**: path_id and trace_id bind to trace; optimization influence (influence/optimization-influence.md) links path result to decisions.

## Relationship to Other Models

- **Constraint model**: optimization/constraint-model.md defines constraints; constraint_refs and constraint_slacks reference them.
- **Tradeoff model**: optimization/tradeoff-model.md defines tradeoffs; multi_objective path may have tradeoff weights.
- **Decision frontier**: optimization/decision-frontier.md defines frontier structure; frontier_ref links to it.
- **Optimization influence**: influence/optimization-influence.md links optimization result to decision.

## Contract

- Optimization paths are recorded when optimization runs (at instrumentation boundary); no change to solver or objective logic.
