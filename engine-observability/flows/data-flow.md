# Data Flow Model

## Definition

**Data flow** is the path of data (inputs, intermediates, outputs) through the engine. This model defines how to observe and trace data movement for cognitive observability—without altering data handling logic.

## Data Flow Stage Schema

```yaml
stage_id: string
trace_id: string
sequence: integer

stage_type: enum [ingestion | transform | validation | enrichment | consumption | emission]
source_ref: string | null  # prior stage or external input
sink_ref: string | null   # next stage or output

artifact_ref: string  # data artifact (payload, entity, or ref)
schema_ref: string | null
domain: string
component: string
timestamp: ISO8601
```

## Stage Types (Semantics)

| Type | Description | Observable |
|------|-------------|------------|
| **ingestion** | Data received from external or upstream | source_ref = external |
| **transform** | Data transformed (map, filter, aggregate) | source_ref, sink_ref |
| **validation** | Validation applied; pass/fail | result_ref |
| **enrichment** | Data enriched (lookup, join) | source_refs (multiple) |
| **consumption** | Data consumed by reasoning or decision | sink_ref = step_id |
| **emission** | Data emitted as output | sink_ref = output |

## Flow Graph

- **Nodes**: Stages; each has artifact_ref (or ref to artifact).
- **Edges**: source_ref → stage_id → sink_ref; forms DAG of data movement.
- **Lineage**: Backward path from any stage to ingestion; forward path to emission or consumption.

## Propagation Rules

1. **Lineage**: Every consumption and emission stage has a backward path to at least one ingestion (or prior run output).
2. **No orphan data**: Every artifact_ref is produced by one stage and consumed by zero or more stages.
3. **Trace binding**: All stages share trace_id for request-scoped flow; batch may use batch_id.

## Relationship to Other Models

- **Decision graph**: Consumption stages link to reasoning/decision nodes (sink_ref = step_id or decision_id).
- **Data influence**: data-influence.md attributes outcomes to data; data flow is the movement path.
- **Inference flow**: inference-flow.md is a specialized data flow through inference stages.

## Contract

- Data flow stages are recorded at boundaries (ingestion, after transform, before/after consumption, emission).
- Additive only; no change to data pipeline logic.
