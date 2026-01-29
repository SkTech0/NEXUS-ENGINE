# Tradeoff Model (Explainability)

## Definition

The **tradeoff model** for explainability is the representation of multi-objective tradeoffs (objectives, weights, selected point) in a form suitable for human interpretation. It is derived from ECOL optimization tradeoff and decision frontier—without altering engine logic.

## Tradeoff Explanation Structure

```yaml
tradeoff_explanation_id: string
trace_id: string
target_ref: string  # decision_id or output_ref
generated_at: ISO8601
locale: string

# Objectives
objective_refs: string[]  # e.g. risk, return
objective_names: map  # objective_ref -> human-readable name
weights: map  # objective_ref -> weight
weight_type: enum [fixed | Pareto | user]
weights_readable: string  # e.g. "Risk 0.6, Return 0.4"

# Selected point
selected_point_ref: string
objective_values: map  # objective_ref -> value at selected point
objective_values_readable: string  # e.g. "Risk=0.3, Return=0.7"
on_frontier: boolean  # true if selected point is on Pareto frontier

# Summary
tradeoff_summary: string  # human-readable summary of tradeoff and selection
constraint_binding_readable: string | null  # e.g. "Risk constraint binding"
```

## Deterministic Rules

1. **Objective names**: objective_names from catalog or ref (mappings); deterministic for same ref.
2. **Weights readable**: weights_readable = f(objective_names, weights, locale); deterministic.
3. **Summary**: tradeoff_summary = f(objectives, weights, selected values, on_frontier, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL tradeoff record (optimization/tradeoff-model), optimization influence, optional decision frontier.
- **Output**: tradeoff_explanation with objectives, weights, selected point, and generated readable.
- **Rules**: See optimization-explainability/tradeoff-explanation.md.

## Contract

- Tradeoff explanation is read-only over ECOL optimization; no change to optimization or selection logic.
- tradeoff_explanation_id is immutable; target_ref and trace_id are required for audit.
