# Decision Frontier Explanation

## Definition

**Decision frontier explanation** is the representation of the Pareto or feasible frontier from which a decision was selected: dimensions, points (or parametric form), selected point, and narrative. It is derived from ECOL decision frontier—without altering optimization logic.

## Schema

```yaml
frontier_explanation_id: string
trace_id: string
frontier_ref: string  # frontier_id from ECOL
target_ref: string  # decision_id or selected_point_ref
generated_at: ISO8601
locale: string

# Frontier context
objective_refs: string[]  # dimensions (e.g. risk, return)
objective_names: map  # objective_ref -> human-readable name
constraint_refs: string[]
representation_type: enum [discrete | parametric]
representation_type_readable: string  # e.g. "Discrete frontier"

# Points (when discrete)
points: list of:
  point_id: string
  objective_values: map  # objective_ref -> value
  objective_values_readable: string  # e.g. "Risk=0.2, Return=0.8"
  binding_constraints: list of string
  binding_constraints_readable: string | null
  is_selected: boolean

# Selected point
selected_point_id: string
selected_point_readable: string  # e.g. "Point P3 (Risk=0.3, Return=0.7)"
selected_objective_values: map
selected_binding_constraints_readable: string | null  # e.g. "Risk limit binding"

# Summary
summary: string  # human-readable summary of frontier and selection
point_count: integer
```

## Deterministic Rules

1. **Objective names**: objective_names from catalog; deterministic for same ref.
2. **Objective values readable**: objective_values_readable = f(objective_values, objective_names, locale); deterministic.
3. **Binding constraints readable**: binding_constraints_readable = f(binding_constraints, locale); catalog or ref to readable name.
4. **Selected point readable**: selected_point_readable = f(selected_point_id, selected_objective_values, objective_names, locale); deterministic.
5. **Summary**: summary = f(representation_type_readable, objective_names, point_count, selected_point_readable, selected_binding_constraints_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL decision frontier (optimization/decision-frontier.md), tradeoff (optimization/tradeoff-model.md) for selected_point_id.
- **Output**: frontier_explanation with points (enriched with objective_values_readable, binding_constraints_readable), selected point, summary.
- **Rules**: See mappings/ecol-to-eel-mapping.md; parametric representation may have parametric_ref and summary only (no discrete points list) when representation_type=parametric.

## Contract

- Frontier explanation is read-only over ECOL decision frontier; no change to frontier computation or selection logic.
- frontier_explanation_id is immutable; frontier_ref and target_ref are required for audit.
