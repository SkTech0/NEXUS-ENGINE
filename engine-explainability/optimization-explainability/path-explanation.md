# Path Explanation (Optimization)

## Definition

**Path explanation** is the representation of the optimization path (solver steps, constraint checks, selection) that led to a chosen solution: ordered steps, outcomes, and narrative. It is derived from ECOL optimization paths—without altering optimization logic.

## Schema

```yaml
path_explanation_id: string
trace_id: string
path_ref: string  # path_id from ECOL
target_ref: string  # decision_id or selected_point_ref
generated_at: ISO8601
locale: string

# Path context
optimization_type: enum [single_objective | multi_objective | constraint_satisfaction]
solver_ref: string | null
objective_refs: string[]
constraint_refs: string[]
path_type_readable: string  # e.g. "Multi-objective optimization path"

# Steps (ordered)
steps: list of:
  step_id: string
  sequence: integer
  step_type: enum [evaluate | constraint_check | solve | select]
  step_type_readable: string
  timestamp: ISO8601 | null
  input_ref: string | null
  output_ref: string | null
  objective_value: float | null
  objective_value_readable: string | null  # e.g. "Objective value 0.85"
  constraint_slacks: map | null  # constraint_ref -> slack
  constraint_slacks_readable: string | null  # e.g. "C1: 0 (binding), C2: 0.1"
  step_summary: string  # e.g. "Solved; selected point P1"

# Result
selected_point_ref: string
selected_point_readable: string | null  # e.g. "Point P1 (Risk=0.3, Return=0.7)"
duration_ms: number | null
duration_readable: string | null  # e.g. "Completed in 120ms"

# Summary
summary: string  # human-readable summary of full path
step_count: integer
```

## Deterministic Rules

1. **Path type readable**: path_type_readable = f(optimization_type, locale); deterministic.
2. **Step type readable**: step_type_readable = f(step_type, locale); deterministic.
3. **Step summary**: step_summary = f(step_type, objective_value, constraint_slacks, output_ref, locale); template-based, deterministic.
4. **Summary**: summary = f(path_type_readable, step_count, steps (with step_summary), selected_point_readable, duration_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL optimization path (optimization/optimization-paths.md) with steps.
- **Output**: path_explanation with steps (enriched with step_type_readable, objective_value_readable, constraint_slacks_readable, step_summary), selected point, duration, summary.
- **Rules**: See mappings/ecol-to-eel-mapping.md; readable from cognition-to-language.

## Contract

- Path explanation is read-only over ECOL optimization path; no change to solver or path logic.
- path_explanation_id is immutable; path_ref and target_ref are required for audit.
