# Propagation Graph Model (Visualization)

## Definition

The **propagation graph** for visualization is the canonical structure for representing propagation paths (influence, failure, recovery, confidence, trust) as a directed graph for display. This document defines the visualization-oriented propagation graph—without altering engine logic.

## Propagation Graph Schema

```yaml
graph_id: string
trace_id: string | null
propagation_type: enum [influence | failure | recovery | confidence | trust]
created_at: ISO8601

# Nodes (sources and sinks)
nodes: list of:
  node_id: string
  node_type: enum [source | sink | intermediate]
  ref: string  # step_id, decision_id, component_id, etc.
  label: string | null
  timestamp: ISO8601 | null
  value: float | null  # e.g. confidence, trust, severity
  metadata: map

# Edges (propagation events)
edges: list of:
  edge_id: string
  from_node: node_id
  to_node: node_id
  propagation_id: string  # from causality/propagation.md
  magnitude: float | null
  hop: integer
  path: list of node_id | null  # optional path for multi-hop
  metadata: map
```

## Propagation Types (Semantics)

| Type | Source | Use |
|------|--------|-----|
| **influence** | causality/propagation.md type=influence | Influence propagation visualization |
| **failure** | failures/cascade-model.md | Failure cascade visualization |
| **recovery** | traces/recovery-trace.md | Recovery path visualization |
| **confidence** | flows/confidence-flow.md | Confidence flow visualization |
| **trust** | flows/trust-flow.md | Trust flow visualization |

## Propagation Rules

1. **Node identity**: node_id and ref must match source model (e.g. step_id, failure_id).
2. **Edge identity**: edge_id and propagation_id link to causality/propagation.md or cascade/recovery trace.
3. **Hop**: hop and path support multi-hop visualization (e.g. failure cascade depth).

## Relationship to Other Models

- **Propagation**: causality/propagation.md is the source for propagation events.
- **Cascade**: failures/cascade-model.md is the source for failure propagation.
- **Graph model**: visualization-models/graph-model.md is the generic graph; propagation graph is a specialized view.

## Contract

- Propagation graph for visualization is a view over propagation and cascade data; ECOL defines the schema; layout and rendering are implementation.
