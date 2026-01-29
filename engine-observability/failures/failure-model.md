# Failure Model

## Definition

**Failure** in ECOL is an observable event where an operation, component, or expectation did not succeed: error, timeout, violation, or resource unavailability. This model defines failure structure for cognitive observability—without altering error handling.

## Failure Schema

```yaml
failure_id: string
trace_id: string | null
timestamp: ISO8601

failure_type: enum [error | timeout | violation | resource | policy]
severity: enum [low | medium | high | critical]
ref: string  # span_id, step_id, component_id, or resource id

# Context
message: string | null
code: string | null
component: string | null
domain: string | null

# Causality
cause_ref: string | null  # upstream failure if propagated
propagation_hop: integer  # 0 = root, 1+ = cascaded

# Recovery
recovery_trace_ref: string | null  # set when recovery is triggered
```

## Failure Types (Semantics)

| Type | Description |
|------|-------------|
| **error** | Exception or error return from operation |
| **timeout** | Operation exceeded time limit |
| **violation** | Invariant, contract, or policy violation |
| **resource** | Resource exhausted or unavailable |
| **policy** | Policy denied or rejected (e.g. trust gate) |

## Propagation Rules

1. **Hop**: propagation_hop = 0 for root failure; increment when failure is propagated to downstream.
2. **Cause**: cause_ref links to parent failure in cascade; see cascade-model.md.
3. **Recovery**: recovery_trace_ref is set when a recovery flow is started in response to this failure.

## Relationship to Other Models

- **Failure trace**: traces/failure-trace.md is the trace structure containing one or more failures.
- **Cascade**: failures/cascade-model.md defines how failures propagate.
- **Recovery**: recovery/recovery-model.md defines recovery; failure links to recovery via recovery_trace_ref.

## Contract

- Failures are recorded when detected (at instrumentation boundaries); no change to error handling logic.
- Severity is optional and may be derived from type or policy.
