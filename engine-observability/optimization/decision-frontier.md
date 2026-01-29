# Decision Frontier Model

## Definition

**Decision frontier** is the set of Pareto-optimal or feasible-boundary points from which a decision was selected (e.g. risk-return frontier, eligibility boundary). This model defines frontier structure for observability—without altering optimization logic.

## Decision Frontier Schema

```yaml
frontier_id: string
trace_id: string
timestamp: ISO8601

# Dimensions
objective_refs: string[]  # e.g. ["risk", "return"]
constraint_refs: string[]  # constraints defining boundary

# Frontier representation (one of)
points: list of:
  point_id: string
  objective_values: map  # objective_ref -> value
  constraint_slacks: map | null  # constraint_ref -> slack
  binding_constraints: string[]  # constraint_refs that are binding at this point

# Or parametric/functional representation (optional)
representation_type: enum [discrete | parametric]
parametric_ref: string | null  # if parametric

# Selected point
selected_point_id: string | null  # point_id from points or reference to selected point
```

## Propagation Rules

1. **Pareto**: For multi-objective, points on frontier are Pareto-optimal (no other point dominates).
2. **Binding**: binding_constraints at a point are the constraints active at that point; constraint_slacks = 0 for those.
3. **Selected point**: selected_point_id links to the point chosen by the engine; tradeoff (tradeoff-model.md) may record weights used to select it.

## Relationship to Other Models

- **Optimization paths**: optimization/optimization-paths.md frontier_ref links to frontier_id.
- **Tradeoff**: optimization/tradeoff-model.md frontier_ref and point_on_frontier link tradeoff to frontier.
- **Optimization influence**: influence/optimization-influence.md influence_type=selected_point links decision to frontier point.

## Contract

- Frontiers are recorded when optimization produces a frontier (at instrumentation boundary); no change to solver or frontier computation logic.
- representation_type discrete = explicit list of points; parametric = curve or function reference (implementation-specific).
