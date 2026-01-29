# Optimization Reasoning Explainability

## Definition

**Optimization reasoning explainability** is the representation of how optimization (solver, objectives, constraints) led to a chosen solution: path steps, objective values, constraint binding, and narrative. It is derived from ECOL optimization paths and constraint model—without altering optimization logic.

## Schema

```yaml
optimization_reasoning_explanation_id: string
trace_id: string
target_ref: string  # decision_id or selected_point_ref
path_ref: string  # path_id from ECOL optimization paths
generated_at: ISO8601
locale: string

# Optimization type
optimization_type: enum [single_objective | multi_objective | constraint_satisfaction]
optimization_type_readable: string  # e.g. "Multi-objective optimization"

# Steps (from ECOL optimization path steps)
steps: list of:
  step_id: string
  sequence: integer
  step_type: enum [evaluate | constraint_check | solve | select]
  step_type_readable: string  # e.g. "Constraint check"
  input_ref: string | null
  output_ref: string | null
  objective_value: float | null
  constraint_slacks_readable: map | null  # constraint_ref -> slack readable
  step_summary: string | null  # e.g. "Constraint C1 binding (slack 0)"

# Selected point
selected_point_ref: string
objective_values: map  # objective_ref -> value
objective_values_readable: string  # e.g. "Risk=0.3, Return=0.7"
binding_constraints: list of string  # constraint_refs that are binding
binding_constraints_readable: string  # e.g. "Risk limit binding"

# Summary
summary: string  # human-readable summary of optimization reasoning
step_count: integer
```

## Deterministic Rules

1. **Step type readable**: step_type_readable = f(step_type, locale); deterministic (e.g. constraint_check → "Constraint check").
2. **Constraint slacks readable**: constraint_slacks_readable = f(constraint_ref, slack, locale); deterministic (e.g. slack 0 → "binding").
3. **Objective values readable**: objective_values_readable = f(objective_values, locale); deterministic template.
4. **Binding constraints readable**: binding_constraints_readable = f(binding_constraints, locale); deterministic (catalog or ref to readable name).
5. **Summary**: summary = f(optimization_type_readable, steps (with step_summary), selected_point_ref, objective_values_readable, binding_constraints_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL optimization path (optimization/optimization-paths.md), constraint model (optimization/constraint-model.md).
- **Output**: optimization_reasoning_explanation with steps (enriched with step_type_readable, constraint_slacks_readable, step_summary), selected point, binding constraints, summary.
- **Rules**: See mappings/ecol-to-eel-mapping.md; constraint readable names from catalog (mappings/cognition-to-language).

## Contract

- Optimization reasoning explanation is read-only over ECOL optimization; no change to solver or constraint logic.
- optimization_reasoning_explanation_id is immutable; path_ref and target_ref are required for audit.
