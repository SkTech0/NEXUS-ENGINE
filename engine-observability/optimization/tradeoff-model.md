# Tradeoff Model

## Definition

**Tradeoff** in ECOL is the exchange between two or more objectives (e.g. risk vs return, accuracy vs latency). This model defines how tradeoffs are represented for observability: objectives, weights, and selected point—without altering optimization logic.

## Tradeoff Schema

```yaml
tradeoff_id: string
trace_id: string
timestamp: ISO8601

# Objectives
objective_refs: string[]  # e.g. ["risk", "return"]
weights: map  # objective_ref -> weight (normalized or absolute)
weight_type: enum [fixed | Pareto | user]

# Selected point
selected_point_ref: string
objective_values: map  # objective_ref -> value at selected point

# Frontier (optional)
frontier_ref: string | null  # link to decision-frontier
point_on_frontier: boolean  # true if selected point is on Pareto frontier
```

## Propagation Rules

1. **Weights**: weights sum to 1 when normalized; weight_type indicates how weights were set (fixed, Pareto, user).
2. **Selected point**: selected_point_ref links to the chosen solution; objective_values are the objective values at that point.
3. **Frontier**: When frontier_ref is set, point_on_frontier indicates whether selected point is on the Pareto frontier.

## Relationship to Other Models

- **Decision frontier**: optimization/decision-frontier.md defines the frontier; tradeoff selects a point on or off frontier.
- **Optimization paths**: optimization/optimization-paths.md may record tradeoff weights used in multi-objective solve.
- **Optimization influence**: influence/optimization-influence.md influence_type=tradeoff links tradeoff to decision.

## Contract

- Tradeoffs are recorded when a multi-objective decision is made (at instrumentation boundary); no change to optimization or weighting logic.
