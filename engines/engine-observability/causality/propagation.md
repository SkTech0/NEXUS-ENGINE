# Propagation Model

## Definition

**Propagation** is the spread of influence, state, or failure from one component or step to another along defined or observed paths. This model defines how propagation is represented for cognitive observability (influence propagation, failure cascade, confidence/trust flow).

## Propagation Event Schema

```yaml
propagation_id: string
trace_id: string
propagation_type: enum [influence | state | failure | recovery | confidence | trust]

source_type: enum [node | step | decision | component | external]
source_ref: string
source_timestamp: ISO8601

sink_type: enum [node | step | decision | component]
sink_ref: string
sink_timestamp: ISO8601

payload_type: enum [value | delta | signal | reference]
payload_ref: string | null  # reference to value or delta
magnitude: float | null  # optional strength or distance
hop: integer  # 0 = direct, 1+ = indirect
path: list of refs  # optional path from source to sink
```

## Propagation Types (Semantics)

| Type | Description | Observable |
|------|-------------|------------|
| **influence** | A decision or output influenced a downstream step | influence graph edge |
| **state** | State change propagated (e.g. cache, config) | state diff |
| **failure** | Failure or error propagated | failure cascade edge |
| **recovery** | Recovery action or signal propagated | recovery trace |
| **confidence** | Confidence score or update propagated | confidence flow |
| **trust** | Trust score or update propagated | trust flow |

## Propagation Graph

- **Nodes**: Sources and sinks (steps, decisions, components).
- **Edges**: Propagation events with type, magnitude, hop.
- **Paths**: Optional explicit path (ordered list of refs) for multi-hop propagation.

## Propagation Rules

1. **Hop semantics**: hop=0 means direct (source directly affected sink); hop>0 means propagated through intermediate nodes; path may list them.
2. **Temporal order**: source_timestamp <= sink_timestamp for all propagation types.
3. **Trace scope**: propagation_id and trace_id bind the event to a trace; cross-trace propagation uses a separate trace_id or link trace refs.
4. **Magnitude**: When present, magnitude is type-specific (e.g. influence weight, confidence delta, error severity).

## Relationship to Other Models

- **Causality**: Propagation can imply indirect causality when propagation_type is influence or state.
- **Failure cascade**: failure propagation is detailed in failures/cascade-model.md.
- **Influence**: influence propagation is detailed in influence/ engine-influence.md and related.

## Contract

- Propagation events are emitted at boundaries defined in instrumentation (e.g. propagation-hooks.md).
- Recording propagation does not alter engine behavior; it is observational only.
