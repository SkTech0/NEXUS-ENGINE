# Tradeoff Explanation

## Definition

**Tradeoff explanation** is the representation of how multi-objective tradeoffs were resolved: objectives, weights, selected point, and narrative. It is derived from ECOL tradeoff model and decision frontier—without altering optimization or selection logic.

## Schema

```yaml
tradeoff_explanation_id: string
trace_id: string
target_ref: string  # decision_id or output_ref
generated_at: ISO8601
locale: string

# Objectives
objective_refs: string[]  # e.g. risk, return
objective_names: map  # objective_ref -> human-readable name
objectives_readable: string  # e.g. "Risk, Return"

# Weights
weights: map  # objective_ref -> weight
weight_type: enum [fixed | Pareto | user]
weight_type_readable: string  # e.g. "User-specified weights"
weights_readable: string  # e.g. "Risk 60%, Return 40%"

# Selected point
selected_point_ref: string
objective_values: map  # objective_ref -> value at selected point
objective_values_readable: string  # e.g. "Risk=0.3, Return=0.7"
on_frontier: boolean
on_frontier_readable: string  # e.g. "Point on Pareto frontier"

# Constraint binding (when applicable)
constraint_binding_ref: string | null
constraint_binding_readable: string | null  # e.g. "Risk limit binding"

# Summary
summary: string  # human-readable summary of tradeoff and selection
```

## Deterministic Rules

1. **Objective names**: objective_names from catalog (mappings/cognition-to-language); deterministic for same ref.
2. **Weights readable**: weights_readable = f(objective_names, weights, locale); deterministic (e.g. "Risk 60%, Return 40%").
3. **Weight type readable**: weight_type_readable = f(weight_type, locale); deterministic.
4. **On frontier readable**: on_frontier_readable = f(on_frontier, locale); deterministic (e.g. true → "Point on Pareto frontier").
5. **Summary**: summary = f(objectives_readable, weights_readable, objective_values_readable, on_frontier_readable, constraint_binding_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL tradeoff (optimization/tradeoff-model.md), decision frontier (optimization/decision-frontier.md), optimization influence (influence/optimization-influence.md).
- **Output**: tradeoff_explanation with objectives, weights, selected point, on_frontier, constraint binding, summary.
- **Rules**: See models/tradeoff-model.md; objective names from catalog.

## Contract

- Tradeoff explanation is read-only over ECOL optimization; no change to optimization or selection logic.
- tradeoff_explanation_id is immutable; target_ref and trace_id are required for audit.
