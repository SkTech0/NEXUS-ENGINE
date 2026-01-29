# Decision Tree Model (Visualization)

## Definition

The **decision tree model** for visualization is the canonical structure for representing the decision flow as a tree (or DAG): decisions as nodes, branches as edges, outcomes as leaves. This document defines the visualization-oriented decision tree—without altering engine logic.

## Decision Tree Schema

```yaml
tree_id: string
trace_id: string
created_at: ISO8601

# Nodes (decisions and outcomes)
nodes: list of:
  node_id: string
  node_type: enum [decision | outcome | branch]
  ref: string  # decision_id or outcome_ref
  label: string | null
  branch_taken: string | null  # for decision nodes: which branch was taken
  outcome_type: enum [approve | deny | refer | defer | custom] | null  # for outcome nodes
  parent_id: node_id | null  # parent decision (null for root)
  children: list of node_id  # child decisions or outcomes
  sequence: integer | null
  timestamp: ISO8601 | null
  metadata: map

# Edges (decision -> branch -> child)
edges: list of:
  edge_id: string
  from_node: node_id
  to_node: node_id
  edge_type: enum [branch | outcome]
  branch_label: string | null  # e.g. "approve", "tier_1"
  metadata: map
```

## Propagation Rules

1. **Tree structure**: Root is the first decision (parent_id = null); children are sub-decisions or outcomes; edges connect decision to branch to child.
2. **Branch taken**: For each decision node, branch_taken identifies which branch was taken; edges with that branch_label are highlighted for “path taken” visualization.
3. **Source**: Tree is built from flows/decision-flow.md; node_id and ref match decision_id and outcome_ref.

## Relationship to Other Models

- **Decision flow**: flows/decision-flow.md is the source; decision tree is the tree view for visualization.
- **Decision graph**: cognition/decision-graph.md is the full graph (includes reasoning); decision tree is the decision-only tree view.
- **Graph model**: visualization-models/graph-model.md is the generic graph; decision tree is a specialized view.

## Contract

- Decision tree for visualization is a view over decision flow; ECOL defines the schema; layout (e.g. top-down tree, left-right) is implementation.
