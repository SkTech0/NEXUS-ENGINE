# Correlation Model

## Definition

**Correlation** is the observed co-occurrence or statistical association between observability entities (events, states, traces). Unlike causality, correlation does not assert cause-effect; it supports grouping, search, and exploratory analysis.

## Correlation Types

| Type | Description | Use |
|------|-------------|-----|
| **Trace correlation** | Same trace_id | Group all spans/events for one request or run |
| **Temporal correlation** | Same time window or sequence | Co-occurrence analysis |
| **Artifact correlation** | Shared artifact_ref or entity_id | Follow an entity across steps |
| **Domain correlation** | Same domain or component | Filter by business area |
| **Statistical correlation** | Derived association (e.g. same failure pattern) | Anomaly or pattern analysis |

## Correlation Key Schema

```yaml
correlation_key: string  # e.g. trace_id, entity_id, correlation_id
type: enum [trace | temporal | artifact | domain | statistical]
values: map  # key-specific; e.g. trace_id: "abc", entity_id: "loan-123"
scope: enum [request | session | batch | global]
created_at: ISO8601
```

## Correlation Index (Query Support)

For query and visualization, the following index structures are defined (logical; implementation may vary):

- **By trace_id**: All events, steps, decisions, and state changes for a trace.
- **By artifact_ref**: All steps and decisions that read or wrote the artifact.
- **By entity_id**: All traces and decisions touching the entity (e.g. application_id).
- **By time range**: Events in [t_start, t_end] for timeline and replay.
- **By domain/component**: Filter for underwriting, pricing, etc.

## Relationship to Causality

- **Causality** requires temporal order and attribution; **correlation** does not.
- A causal pair is always correlated (same trace or linked refs); the reverse is false.
- Use correlation for discovery and grouping; use causality for explanation and audit.

## Propagation Rules

1. **Trace binding**: Every observability event should carry trace_id (or equivalent) for trace correlation.
2. **Artifact binding**: Events that consume or produce artifacts should carry artifact_ref for artifact correlation.
3. **Statistical correlation**: Computed offline or in a separate analysis pipeline; not assumed to be real-time.

## Contract

- Correlation keys are non-invasive: they are attached to existing events/spans by the instrumentation layer.
- No business logic depends on correlation; it is for observability and analysis only.
