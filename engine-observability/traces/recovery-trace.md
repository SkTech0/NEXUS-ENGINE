# Recovery Trace Model

## Definition

A **recovery trace** is the record of recovery actions (retries, fallbacks, compensation, self-healing) taken after a failure or degradation. It supports analysis of how the engine recovers—without altering recovery logic.

## Recovery Trace Schema

```yaml
trace_id: string (opaque; may be same as request trace or dedicated recovery trace)
trace_type: "recovery"
started_at: ISO8601
ended_at: ISO8601 | null

# Trigger
trigger_type: enum [failure | degradation | timeout | policy]
trigger_ref: string  # failure_id, span_id, or event id
original_trace_id: string | null  # request trace that triggered recovery

# Recovery actions (ordered)
actions: list of:
  action_id: string
  sequence: integer
  timestamp: ISO8601
  action_type: enum [retry | fallback | compensation | self_heal | escalate]
  target_ref: string  # component, step, or resource
  outcome: enum [success | failure | partial]
  duration_ms: number | null
  metadata: map

# Result
final_outcome: enum [recovered | degraded | failed]
stabilization_ref: string | null  # link to stabilization record if applicable
```

## Action Types (Semantics)

| Type | Description | Observable |
|------|-------------|------------|
| **retry** | Same operation retried | target_ref, outcome |
| **fallback** | Alternative path taken | target_ref, fallback_path_ref |
| **compensation** | Compensating action (e.g. rollback) | target_ref, compensation_ref |
| **self_heal** | Automatic repair (e.g. circuit breaker reset) | target_ref, outcome |
| **escalate** | Escalated to human or external | target_ref |

## Propagation Rules

1. **Ordering**: actions are ordered by sequence; order reflects actual recovery sequence.
2. **Trigger binding**: trigger_ref links to the failure or event that started recovery; original_trace_id links to the request trace.
3. **Final outcome**: final_outcome is the state after all recovery actions; recovered, degraded, or failed.

## Relationship to Other Models

- **Recovery model**: recovery/recovery-model.md defines recovery semantics; this is the trace structure.
- **Failure trace**: failure trace records the failure; recovery trace records the response (see failure-trace.md).
- **Fallback**: failures/fallback-model.md defines fallback behavior; recovery trace records when fallback was used.

## Contract

- Recovery traces are produced when recovery actions are taken (at instrumentation boundaries in recovery-hooks.md).
- Additive only; no change to recovery logic.
