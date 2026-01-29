# Influence Graph Model (Visualization)

## Definition

The **influence graph** for visualization is the canonical structure for representing influence (engine, data, AI, trust, optimization) as a directed graph with contribution weights for display. This document defines the visualization-oriented influence graph—without altering engine logic.

## Influence Graph Schema

```yaml
graph_id: string
trace_id: string
created_at: ISO8601

# Nodes (influencers and influenced)
nodes: list of:
  node_id: string
  node_type: enum [input | reasoning | decision | output | component | model | data_source]
  ref: string
  label: string | null
  influence_type: enum [engine | data | ai | trust | optimization] | null  # when node is influencer
  metadata: map

# Edges (influence with contribution)
edges: list of:
  edge_id: string
  from_node: node_id  # influencer
  to_node: node_id    # influenced
  influence_type: enum [engine | data | ai | trust | optimization]
  contribution: float | null  # [0,1]
  direction: enum [positive | negative | neutral] | null
  evidence_ref: string | null
  metadata: map
```

## Propagation Rules

1. **Node identity**: node_id and ref must match source (step_id, decision_id, artifact_ref, model_id, etc.).
2. **Edge source**: Edges are built from influence/* (engine-influence, data-influence, ai-influence, trust-influence, optimization-influence).
3. **Contribution**: contribution is optional; when present, sum of contributions into a node can be used for “contribution breakdown” visualization.

## Relationship to Other Models

- **Influence**: influence/* provides the raw influence records; influence graph is the aggregated view for visualization.
- **Decision graph**: cognition/decision-graph.md has influenced_by edges; influence graph may be a superset (includes contribution and type).
- **Explainability**: trust-confidence/explainability.md contribution_breakdown can be derived from influence graph.

## Contract

- Influence graph for visualization is a view over influence records; ECOL defines the schema; layout and rendering are implementation.
