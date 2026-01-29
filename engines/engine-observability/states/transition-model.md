# Transition Model

## Definition

**Transition** is a change from one observable state to another (cognitive phase, decision status, engine mode, recovery outcome). This model defines how transitions are represented for observability and timeline reconstruction.

## Transition Schema

```yaml
transition_id: string
trace_id: string | null  # null if global state transition
timestamp: ISO8601

# State type
state_type: enum [cognitive_phase | decision_status | engine_mode | recovery_outcome | failure_cascade]
entity_ref: string  # state_id, decision_id, component_id, etc.

# Transition
from_state: string  # previous value
to_state: string    # new value
trigger_ref: string | null  # event, failure, or step that caused transition
trigger_type: enum [internal | external | failure | recovery | policy] | null
```

## State Types (Semantics)

| State type | from_state / to_state | Entity ref |
|------------|------------------------|------------|
| **cognitive_phase** | ingestion, context, reasoning, decision, emission | trace_id or run_id |
| **decision_status** | pending, in_progress, completed, failed, delegated | decision_id |
| **engine_mode** | normal, degraded, maintenance, failover | component_id |
| **recovery_outcome** | recovered, degraded, failed | recovery_trace_id |
| **failure_cascade** | failure level or hop | failure_id |

## Propagation Rules

1. **Temporal order**: Transitions are ordered by timestamp; from_state is the state before, to_state is the state after.
2. **Trigger**: trigger_ref links to the event or entity that caused the transition (e.g. step_id, failure_id); optional but recommended for audit.
3. **Trace binding**: When transition is request-scoped, trace_id is set; when global (e.g. engine mode), trace_id may be null.

## Relationship to Other Models

- **Cognitive state**: Phase transitions are transitions with state_type = cognitive_phase.
- **Decision state**: Decision status changes are transitions with state_type = decision_status.
- **Engine state**: Mode changes are transitions with state_type = engine_mode.
- **Replay**: replay/timeline-reconstruction.md uses transitions to reconstruct ordering and causality.

## Contract

- Transitions are emitted when state changes are observed (at instrumentation boundaries).
- Additive only; no change to state machine logic.
