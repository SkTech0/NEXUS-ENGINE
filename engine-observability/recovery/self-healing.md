# Self-Healing Model

## Definition

**Self-healing** is automatic recovery action performed by the engine or platform without human intervention: retry, circuit breaker reset, cache refresh, failover. This model defines how self-healing actions are represented for cognitive observability—without altering self-healing logic.

## Self-Healing Action Schema

```yaml
action_id: string
recovery_trace_id: string
sequence: integer
timestamp: ISO8601

action_type: enum [retry | circuit_reset | cache_refresh | failover | restart | scale]
target_ref: string  # component, circuit, cache, or resource
target_type: enum [component | circuit | cache | instance]

# Trigger
trigger_ref: string  # failure or degradation that triggered this
condition: string | null  # e.g. "after 3 failures"

# Outcome
outcome: enum [success | failure | partial]
duration_ms: number | null
metadata: map
```

## Action Types (Semantics)

| Type | Description |
|------|-------------|
| **retry** | Same operation retried (possibly with backoff) |
| **circuit_reset** | Circuit breaker reset (e.g. half-open) |
| **cache_refresh** | Cache invalidated or refreshed |
| **failover** | Traffic or workload failed over to backup |
| **restart** | Component or process restarted |
| **scale** | Scaling action (e.g. add instance) |

## Propagation Rules

1. **Trigger**: Every self-healing action has a trigger_ref (failure or degradation).
2. **Target**: target_ref and target_type identify what was acted upon.
3. **Outcome**: outcome and duration_ms record result; metadata may hold type-specific details.

## Relationship to Other Models

- **Recovery**: recovery-model.md includes self_heal as an action type; this document details the structure for self-healing actions.
- **Recovery trace**: traces/recovery-trace.md action_type=self_heal uses this schema.

## Contract

- Self-healing actions are recorded when they occur (at instrumentation boundaries); no change to self-healing logic.
