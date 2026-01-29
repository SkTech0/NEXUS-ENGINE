# Stabilization Model

## Definition

**Stabilization** is the state or condition where the system has reached a stable state after recovery: normal operation restored or a known degraded state accepted. This model defines how stabilization is represented for cognitive observability—without altering stabilization logic.

## Stabilization Schema

```yaml
stabilization_id: string
recovery_trace_id: string
timestamp: ISO8601

outcome: enum [recovered | degraded]
state_ref: string | null  # link to engine state snapshot after stabilization

# Criteria (optional; for audit)
criteria_met: list of string  # e.g. "circuit_closed", "health_check_passed"
duration_since_trigger_ms: number | null
```

## Outcome Semantics

| Outcome | Description |
|---------|-------------|
| **recovered** | Normal operation restored; engine state mode = normal (or equivalent). |
| **degraded** | Stable degraded state; fallback or reduced capability accepted; engine state mode = degraded. |

## Propagation Rules

1. **Recovery binding**: stabilization_id is part of or linked to recovery trace; recovery_trace_id links to the recovery run.
2. **State ref**: state_ref links to engine state snapshot (states/engine-state.md) after stabilization for “state after recovery” queries.
3. **Criteria**: criteria_met is optional and documents what conditions were satisfied for stabilization (audit/explainability).

## Relationship to Other Models

- **Recovery**: recovery-model.md final_outcome = recovered | degraded; stabilization is the record that recovery reached that outcome.
- **Engine state**: states/engine-state.md snapshot after stabilization; state_ref links to it.
- **Recovery trace**: traces/recovery-trace.md stabilization_ref links to stabilization_id.

## Contract

- Stabilization is recorded when recovery completes and stable state is reached (at instrumentation boundary); no change to stabilization logic.
