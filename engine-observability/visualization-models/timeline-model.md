# Timeline Model (Visualization)

## Definition

The **timeline model** for visualization is the canonical structure for representing a chronological view of events (reasoning, decisions, state transitions, failures, recovery) for display. This document defines the visualization-oriented timeline structure—without altering engine logic.

## Timeline Schema (Visualization)

```yaml
timeline_id: string
trace_id: string
reconstructed_at: ISO8601
start_time: ISO8601
end_time: ISO8601

# Events (ordered by time)
events: list of:
  event_id: string
  timestamp: ISO8601
  logical_sequence: integer | null
  event_type: enum [reasoning_step | decision | state_transition | failure | recovery_action | input | output]
  event_ref: string
  label: string | null
  duration_ms: number | null
  lane: string | null  # e.g. "reasoning", "decision", "failure" for swim lanes
  metadata: map
```

## Lane Semantics (Optional)

| Lane | Event types |
|------|-------------|
| **reasoning** | reasoning_step |
| **decision** | decision |
| **state** | state_transition |
| **failure** | failure, recovery_action |
| **data** | input, output |

## Propagation Rules

1. **Ordering**: events are ordered by timestamp ascending; when equal, use logical_sequence.
2. **Source**: Timeline is built from replay/timeline-reconstruction.md; timeline_id may match reconstructed timeline_id.
3. **Lane**: lane is optional; used for swim-lane visualization; event_type can map to lane when lane is null.

## Relationship to Other Models

- **Timeline reconstruction**: replay/timeline-reconstruction.md produces the event list; this document is the visualization view (may add label, lane).
- **Traces**: All trace types contribute events to timeline.

## Contract

- Timeline model for visualization is a view over reconstructed timeline; ECOL defines the schema; rendering (e.g. Gantt, swim lanes) is implementation.
