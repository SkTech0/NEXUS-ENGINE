# Graph Model (Visualization)

## Definition

The **graph model** for visualization is the canonical structure for representing decision graphs, causality graphs, and influence graphs as renderable nodes and edges. This document defines the visualization-oriented graph structure—without altering engine logic.

## Graph Schema (Visualization)

```yaml
graph_id: string
graph_type: enum [decision | causality | influence | propagation]
trace_id: string | null
created_at: ISO8601

# Nodes
nodes: list of:
  node_id: string
  node_type: enum [input | reasoning | decision_point | output | failure | recovery | component]
  label: string | null
  domain: string | null
  timestamp: ISO8601 | null
  metadata: map  # e.g. confidence, trust, artifact_ref
  position: map | null  # x, y for layout (optional; may be computed client-side)

# Edges
edges: list of:
  edge_id: string
  from_node: node_id
  to_node: node_id
  edge_type: enum [depends_on | influenced_by | constrained_by | causal | propagates]
  label: string | null
  weight: float | null
  metadata: map
```

## Graph Types (Semantics)

| Type | Source | Use |
|------|--------|-----|
| **decision** | cognition/decision-graph.md | Decision graph visualization |
| **causality** | causality/causality-model.md | Cause-effect visualization |
| **influence** | influence/* aggregated | Influence graph visualization |
| **propagation** | causality/propagation.md | Propagation path visualization |

## Propagation Rules

1. **Node identity**: node_id must match source model (e.g. step_id, decision_id, node_id from decision-graph).
2. **Edge identity**: edge_id and (from_node, to_node) must match source model.
3. **Layout**: position is optional; layout may be computed by visualization layer (e.g. DAG layout, force-directed).
4. **No cycles (decision)**: For decision graph type, depends_on edges must form a DAG; visualization may enforce acyclic layout.

## Relationship to Other Models

- **Decision graph**: cognition/decision-graph.md is the source for graph_type=decision.
- **Causality**: causality/causality-model.md is the source for graph_type=causality.
- **Influence graph**: visualization-models/influence-graph.md is a specialized view of influence.
- **Propagation graph**: visualization-models/propagation-graph.md is a specialized view of propagation.

## Contract

- Graph model for visualization is a view over stored traces and graphs; production engine does not emit this format directly unless a visualization service materializes it.
- ECOL defines the schema; layout and rendering are implementation concerns.
