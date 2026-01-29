# Timeline Reconstruction Model

## Definition

**Timeline reconstruction** is the assembly of a chronological view of events (reasoning steps, decisions, state transitions, failures, recovery) from stored traces and state. This model defines how timelines are built for observability and audit—without altering production logic.

## Timeline Event Schema

```yaml
event_id: string
trace_id: string
timestamp: ISO8601
logical_sequence: integer | null  # when wall-clock order is ambiguous

event_type: enum [reasoning_step | decision | state_transition | failure | recovery_action | input | output]
event_ref: string  # step_id, decision_id, transition_id, failure_id, etc.

# Optional for ordering
parent_event_ref: string | null
duration_ms: number | null
```

## Reconstruction Rules

1. **Sources**: Timeline is built from reasoning trace, decision trace, state transitions (states/transition-model.md), failure trace, recovery trace, and optionally execution spans.
2. **Ordering**: Events are ordered by timestamp; when timestamps are equal, use logical_sequence or parent-child to infer order.
3. **Deduplication**: Same logical event (e.g. step_id) may appear in multiple traces; deduplicate by event_ref when building unified timeline.
4. **Gaps**: Missing events (e.g. no trace for a period) are represented as gaps; do not infer events.

## Timeline Artifact Schema

```yaml
timeline_id: string
reconstructed_at: ISO8601
source_trace_ids: string[]

events: list of timeline event (ordered by timestamp, then logical_sequence)
start_time: ISO8601
end_time: ISO8601
event_count: integer
```

## Propagation Rules

1. **Trace binding**: timeline is bound to source_trace_ids; all events belong to those traces or linked traces (e.g. recovery trace linked to request trace).
2. **Immutability**: Reconstructed timeline is a snapshot; rebuilding may produce different order if new data arrives (e.g. late events).
3. **Use**: Timeline supports visualization (visualization-models/timeline-model.md) and audit (replay/audit-replay.md).

## Relationship to Other Models

- **Transition model**: states/transition-model.md provides state transition events for timeline.
- **Traces**: All trace types (reasoning, decision, failure, recovery) contribute events.
- **Visualization**: visualization-models/timeline-model.md consumes timeline for display.

## Contract

- Timeline reconstruction is performed by a dedicated process or query; production engine does not run reconstruction.
- Reconstruction is read-only over stored traces and state.
