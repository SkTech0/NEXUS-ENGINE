# Recovery Model

## Definition

**Recovery** is the process of returning to normal operation or a stable degraded state after a failure or degradation. This model defines recovery semantics: actions, ordering, and outcomes—without altering recovery logic.

## Recovery Run Schema

```yaml
recovery_id: string
trace_id: string  # may be dedicated recovery trace
started_at: ISO8601
ended_at: ISO8601 | null

# Trigger
trigger_type: enum [failure | degradation | timeout | policy]
trigger_ref: string
original_trace_id: string | null  # request trace that triggered recovery

# Actions (ordered)
actions: list of recovery action (see traces/recovery-trace.md)
  - action_id, sequence, action_type, target_ref, outcome, duration_ms

# Result
final_outcome: enum [recovered | degraded | failed]
stabilization_ref: string | null
```

## Recovery Action Types (Summary)

| Type | Description |
|------|-------------|
| **retry** | Same operation retried |
| **fallback** | Alternative path taken |
| **compensation** | Compensating action (rollback, undo) |
| **self_heal** | Automatic repair (e.g. circuit reset) |
| **escalate** | Escalated to human or external |

## Propagation Rules

1. **Ordering**: Actions are ordered by sequence; order reflects actual recovery sequence.
2. **Final outcome**: recovered = back to normal; degraded = stable but reduced capability; failed = recovery did not succeed.
3. **Trigger binding**: trigger_ref links to failure or event; original_trace_id links to the request trace for correlation.

## Relationship to Other Models

- **Recovery trace**: traces/recovery-trace.md is the full trace schema; this document is the semantic model.
- **Self-healing**: recovery/self-healing.md details self-healing actions.
- **Stabilization**: recovery/stabilization.md details stabilization criteria.
- **Compensation**: recovery/compensation.md details compensation actions.

## Contract

- Recovery runs are recorded when recovery is triggered and as actions complete (at instrumentation boundaries); no change to recovery logic.
