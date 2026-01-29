# Failure Trace Model

## Definition

A **failure trace** is the record of failures (errors, timeouts, violations) and their propagation (cascade). It supports analysis of how failures occur and spread—without altering error handling logic.

## Failure Trace Schema

```yaml
trace_id: string (opaque; may be same as request trace or dedicated)
trace_type: "failure"
started_at: ISO8601
ended_at: ISO8601 | null

# Root or primary failure
primary_failure_id: string
primary_ref: string  # span_id, step_id, or component
primary_type: enum [error | timeout | violation | resource]
primary_message: string | null
primary_timestamp: ISO8601

# Cascade (optional)
cascade: list of:
  failure_id: string
  parent_failure_id: string | null
  ref: string
  failure_type: enum [error | timeout | violation | resource | propagated]
  timestamp: ISO8601
  message: string | null
  propagation_hop: integer  # 0 = primary, 1+ = cascaded

# Context
original_trace_id: string | null
domain: string | null
component: string | null
```

## Failure Types (Semantics)

| Type | Description |
|------|-------------|
| **error** | Exception or error return |
| **timeout** | Operation exceeded time limit |
| **violation** | Invariant or contract violation |
| **resource** | Resource exhaustion or unavailable |
| **propagated** | Failure propagated from upstream (cascade) |

## Cascade Rules

1. **Tree**: parent_failure_id forms a tree; primary has parent_failure_id = null.
2. **Hop**: propagation_hop = 0 for primary; increment for each level of cascade.
3. **Temporal**: timestamp of cascaded failure >= timestamp of parent.

## Relationship to Other Models

- **Failure model**: failures/failure-model.md defines failure semantics; this is the trace structure.
- **Cascade model**: failures/cascade-model.md defines how failures propagate; cascade list is the instantiation.
- **Recovery trace**: recovery trace follows failure trace (trigger_ref = primary_failure_id or trace_id).

## Contract

- Failure traces are produced when failures are detected (at instrumentation boundaries in failure-hooks.md).
- Additive only; no change to error handling or propagation logic.
