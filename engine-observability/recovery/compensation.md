# Compensation Model

## Definition

**Compensation** is an action that undoes or counterbalances a prior action (e.g. rollback, cancel, reverse). This model defines how compensation is represented for cognitive observability—without altering compensation logic.

## Compensation Schema

```yaml
compensation_id: string
recovery_trace_id: string
sequence: integer
timestamp: ISO8601

# What is being compensated
compensated_action_ref: string  # span_id, step_id, or action id
compensated_action_type: enum [decision | side_effect | state_change | external_call]

# Compensation action
compensation_type: enum [rollback | cancel | reverse | compensate]
target_ref: string  # resource, state, or external system
outcome: enum [success | failure | partial]
duration_ms: number | null

# Optional
metadata: map
```

## Compensation Types (Semantics)

| Type | Description |
|------|-------------|
| **rollback** | State or transaction rolled back |
| **cancel** | Pending or in-flight operation cancelled |
| **reverse** | Reverse operation (e.g. credit reversal) |
| **compensate** | Compensating action (e.g. Saga pattern) |

## Propagation Rules

1. **Binding**: compensated_action_ref links to the action being compensated; recovery_trace_id links to the recovery run.
2. **Outcome**: outcome and duration_ms record whether compensation succeeded.
3. **Ordering**: Compensation actions are ordered in recovery trace; typically after the failure and possibly after other recovery actions.

## Relationship to Other Models

- **Recovery**: recovery-model.md action_type=compensation; this document details the schema.
- **Recovery trace**: traces/recovery-trace.md action_type=compensation uses this structure.
- **Decision**: If compensated action was a decision or side effect, compensated_action_ref may be decision_id or output_ref.

## Contract

- Compensation is recorded when a compensating action is executed (at instrumentation boundary); no change to compensation logic.
