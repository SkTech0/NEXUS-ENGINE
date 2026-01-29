# Constraint Model

## Definition

**Constraint** in ECOL is a condition or bound that limits the feasible set of decisions or solutions. This model defines how constraints are represented for observability: identity, type, satisfaction, and binding—without altering constraint logic.

## Constraint Schema

```yaml
constraint_id: string
trace_id: string
timestamp: ISO8601

constraint_type: enum [inequality | equality | bound | policy]
constraint_ref: string  # rule id, policy id, or constraint name
expression_ref: string | null  # optional reference to expression or rule

# Evaluation
satisfied: boolean
slack: float | null  # for inequality: slack = rhs - lhs; 0 = binding
binding: boolean  # true if constraint is active (binding)
shadow_price: float | null  # dual value if available

# Context
domain: string | null
component: string | null
```

## Constraint Types (Semantics)

| Type | Description |
|------|-------------|
| **inequality** | g(x) ≤ 0 or g(x) ≥ 0 |
| **equality** | h(x) = 0 |
| **bound** | lb ≤ x ≤ ub |
| **policy** | Policy rule (e.g. eligibility) |

## Propagation Rules

1. **Satisfaction**: satisfied is true when constraint is met; binding is true when constraint is active (e.g. slack = 0 for inequality).
2. **Slack**: slack is optional; when present, 0 slack implies binding for inequality.
3. **Trace binding**: constraint evaluation is scoped to trace_id; same constraint may be evaluated in multiple traces.

## Relationship to Other Models

- **Optimization paths**: optimization/optimization-paths.md references constraint_refs and constraint_slacks.
- **Optimization influence**: influence/optimization-influence.md constraint_ref and influence_type=binding link constraint to decision.
- **Decision frontier**: optimization/decision-frontier.md frontier may be defined by binding constraints.

## Contract

- Constraint evaluations are recorded when constraints are checked (at instrumentation boundary); no change to constraint evaluation logic.
