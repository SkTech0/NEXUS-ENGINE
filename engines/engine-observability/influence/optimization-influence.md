# Optimization Influence Model

## Definition

**Optimization influence** is the effect of optimization steps (objectives, constraints, solvers) on decisions and outcomes. This model defines how to attribute results to optimization for explainability and audit of constrained decisions.

## Optimization Influence Schema

```yaml
influence_id: string
trace_id: string

optimization_ref: string  # solver run, objective id, or constraint set id
optimization_type: enum [objective | constraint | tradeoff | frontier]
component: string  # optimizer component id

influenced_ref: string  # decision_id or output_ref
influence_type: enum [binding | slack | shadow_price | selected_point]
value: float | null  # e.g. shadow price, slack, objective value
constraint_ref: string | null  # which constraint bound (if binding)
```

## Optimization Types

| Type | Description | Observable |
|------|-------------|------------|
| **objective** | Objective function value or gradient | value = objective value |
| **constraint** | Constraint satisfaction or violation | value = slack, constraint_ref |
| **tradeoff** | Tradeoff between objectives | value = weight or Pareto weight |
| **frontier** | Point on Pareto frontier | value = coordinates or ref |

## Influence Type (Semantics)

- **binding**: A constraint was binding (active); decision is on the constraint boundary.
- **slack**: Slack or surplus for a constraint; zero slack implies binding.
- **shadow_price**: Dual value or shadow price; marginal value of relaxing constraint.
- **selected_point**: The chosen point (e.g. on frontier); value may be index or objective vector.

## Propagation Rules

1. **Attribution**: Each optimization influence links one optimization_ref to one influenced_ref.
2. **Constraint binding**: When influence_type is binding, constraint_ref must be set.
3. **Relationship to optimization/**: optimization/optimization-paths.md and constraint-model.md define the full optimization model; this document defines the influence records that link optimization to outcomes.

## Relationship to Decision Frontier

- optimization/decision-frontier.md defines the frontier structure; optimization influence records which point was selected and why (binding constraints, tradeoff weights).

## Contract

- Optimization influence is recorded when an optimizer output or constraint result is used in a decision.
- Additive only; no change to solver or constraint evaluation logic.
