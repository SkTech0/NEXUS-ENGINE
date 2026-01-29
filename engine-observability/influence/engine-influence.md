# Engine Influence Model

## Definition

**Engine influence** is the contribution of engine components (rules, pipelines, services) to decisions and outputs. This model defines how to attribute outcomes to specific engine elements for explainability and audit.

## Engine Influence Schema

```yaml
influence_id: string
trace_id: string

component_id: string  # engine component (e.g. rule_engine, pricing_service)
component_type: enum [rule_set | pipeline | service | orchestrator]
artifact_ref: string  # rule_id, pipeline_id, or service name

influenced_ref: string  # decision_id, step_id, or output_ref
influence_type: enum [deterministic | conditional | default]
contribution: float | null  # [0,1] normalized contribution to outcome
rank: integer | null  # order of application if ordered

input_bindings: map | null  # bound inputs that triggered this component
output_ref: string | null  # artifact produced by this component
```

## Component Types (Semantics)

| Type | Description | Attribution |
|------|-------------|-------------|
| **rule_set** | Set of rules evaluated | rule_ids that fired, contribution per rule |
| **pipeline** | Sequential or DAG of steps | step contributions, pipeline stage |
| **service** | External or internal service call | service name, response used |
| **orchestrator** | Coordinates other components | delegation refs, aggregation |

## Propagation Rules

1. **Single outcome**: Each engine influence record points to one influenced_ref (decision or output).
2. **Contribution sum**: For a given influenced_ref, sum of contribution across engine influences should be ≤ 1 (remaining may be input or AI); allow >1 if normalized elsewhere.
3. **Ordering**: When rank is present, lower rank means earlier in evaluation order.

## Relationship to Decision Graph

- Engine influence records map to edges in the decision graph: component output → influenced node (reasoning or decision_point).
- decision-graph.md edges (depends_on, influenced_by) can be populated or enriched from engine influence.

## Contract

- Engine influence is recorded when a component produces an output that is consumed by a decision or downstream step.
- No change to component logic; recording is at boundary (before/after component call or at result emission).
