# Constraint Explanation

## Definition

**Constraint explanation** is the representation of why a constraint was satisfied, binding, or violated: constraint identity, slack, binding status, shadow price (when available), and narrative. It is derived from ECOL constraint model—without altering constraint logic.

## Schema

```yaml
constraint_explanation_id: string
trace_id: string
target_ref: string  # decision_id or output_ref
constraint_ref: string  # rule id, policy id, constraint name
generated_at: ISO8601
locale: string

# Constraint
constraint_type: enum [inequality | equality | bound | policy]
constraint_type_readable: string  # e.g. "Policy constraint"
constraint_name: string | null  # human-readable name (e.g. "Max LTV ratio")
expression_ref: string | null

# Evaluation
satisfied: boolean
satisfied_readable: string  # e.g. "Constraint satisfied"
slack: float | null  # for inequality: slack = rhs - lhs; 0 = binding
slack_readable: string | null  # e.g. "Slack 0 (binding)"
binding: boolean
binding_readable: string  # e.g. "Constraint is binding"
shadow_price: float | null
shadow_price_readable: string | null  # e.g. "Shadow price 0.02"

# Summary
summary: string  # human-readable summary of constraint and evaluation
```

## Deterministic Rules

1. **Constraint type readable**: constraint_type_readable = f(constraint_type, locale); deterministic.
2. **Satisfied readable**: satisfied_readable = f(satisfied, locale); deterministic (e.g. true → "Constraint satisfied", false → "Constraint violated").
3. **Slack readable**: slack_readable = f(slack, binding, locale); deterministic (e.g. slack 0 → "Slack 0 (binding)", slack > 0 → "Slack 0.1").
4. **Binding readable**: binding_readable = f(binding, locale); deterministic (e.g. true → "Constraint is binding").
5. **Summary**: summary = f(constraint_name, constraint_type_readable, satisfied_readable, slack_readable, binding_readable, shadow_price_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL constraint evaluation (optimization/constraint-model.md).
- **Output**: constraint_explanation with constraint identity, evaluation (satisfied, slack, binding), readable fields, summary.
- **Rules**: constraint_name from catalog (mappings/cognition-to-language); readable from templates.

## Contract

- Constraint explanation is read-only over ECOL constraint model; no change to constraint evaluation logic.
- constraint_explanation_id is immutable; constraint_ref and target_ref are required for audit.
