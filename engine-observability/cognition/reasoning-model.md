# Reasoning Model

## Definition

**Reasoning** is the process by which the engine derives intermediate or final conclusions from inputs, rules, constraints, and optional AI outputs. The reasoning model defines how reasoning steps are structured, attributed, and traced.

## Reasoning Step Schema

```yaml
step_id: string (opaque, unique within trace)
trace_id: string
sequence: integer (monotonic within trace)
timestamp: ISO8601
duration_ms: number | null

# Classification
reasoning_type: enum [rule_based | constraint_satisfaction | inference | aggregation | delegation | fallback]
domain: string
component: string (engine component id)

# Inputs (references, not payloads)
input_refs: string[]  # artifact ids or node ids
rule_ref: string | null
constraint_refs: string[] | null
model_ref: string | null  # if AI involved

# Output
conclusion: string | structured  # type of conclusion
output_ref: string
confidence: [0,1] | null
uncertainty_reason: string | null

# Causality
parent_steps: step_id[]
child_steps: step_id[]
```

## Reasoning Types (Semantics)

| Type | Description | Observable output |
|------|-------------|-------------------|
| `rule_based` | Deterministic rule evaluation | rule_id, result, bindings |
| `constraint_satisfaction` | Constraint check or optimization | constraints_satisfied, slack |
| `inference` | Logical or probabilistic inference | premises, conclusion |
| `aggregation` | Combine multiple sub-results | sources, aggregation_fn |
| `delegation` | Sub-decision or external call | delegate_ref, result_ref |
| `fallback` | Alternative path taken | trigger_reason, fallback_path |

## Relationships

- **Parent/child**: Forms a tree or DAG of reasoning steps. Children are direct logical successors.
- **Input refs**: Link to artifacts or prior steps that were necessary for this step.
- **Output ref**: Links this step to the artifact or decision node it produced.

## Propagation Rules

1. **Sequencing**: `sequence` is monotonic per trace; concurrent steps may share the same logical sequence and be distinguished by `step_id`.
2. **Attribution**: Every step has at least one `input_ref` or `parent_step` unless it is an entry step (triggered by external input).
3. **Conclusion binding**: Every step with `reasoning_type != delegation` has exactly one `output_ref` for the conclusion artifact.

## Contract

- Reasoning steps are emitted by the instrumentation layer at the boundaries defined in `instrumentation/reasoning-hooks.md`.
- No business logic is changed; steps are recorded after the fact or at designated observation points.
- Steps can be correlated with decision graphs via `trace_id` and `step_id` (as node_id in the graph).
