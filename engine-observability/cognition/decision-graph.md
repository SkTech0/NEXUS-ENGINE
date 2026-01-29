# Decision Graph Model

## Definition

A **decision graph** is a directed acyclic structure representing how a single outcome was produced from a set of inputs, intermediate reasoning steps, and decision points. It is the primary structure for reconstructing and auditing engine decisions.

## Schema

### Node Types

| Type | Description | Cardinality |
|------|-------------|-------------|
| `input` | External or upstream datum that contributed to the decision | 0..n |
| `reasoning` | Internal reasoning step (inference, constraint, rule) | 0..n |
| `decision_point` | Explicit choice or branch | 0..n |
| `output` | Final or intermediate decision artifact | 1..n |

### Edge Types

| Type | Description | Semantics |
|------|-------------|-----------|
| `depends_on` | Node B required node A to be evaluated | Causality |
| `influenced_by` | Node B was influenced by A (weaker than depends_on) | Influence |
| `constrained_by` | Node B was constrained by A | Constraint |

### Structural Constraints

- **Acyclicity**: No cycle in `depends_on`. Cycles allowed only in `influenced_by` for feedback loops if explicitly modeled.
- **Roots**: At least one `input` or external trigger per graph.
- **Sinks**: At least one `output` (final decision or intermediate artifact).
- **Reachability**: Every node reachable from at least one root; every sink reachable from at least one node.

## Attributes (per node)

```yaml
node_id: string (opaque, stable within trace)
node_type: enum [input | reasoning | decision_point | output]
timestamp: ISO8601 (logical or wall-clock)
domain: string (e.g. underwriting, pricing, eligibility)
artifact_ref: string | null  # reference to payload or entity
confidence: [0,1] | null
trust_score: [0,1] | null
source: string (engine component or service id)
```

## Attributes (per edge)

```yaml
edge_id: string
from_node: node_id
to_node: node_id
edge_type: enum [depends_on | influenced_by | constrained_by]
weight: float | null  # optional strength or contribution
evidence_ref: string | null
```

## Propagation Rules

1. **Causal closure**: Every `output` has a backward path of `depends_on` edges to at least one `input` or trigger.
2. **Decision attribution**: Every `decision_point` has incoming edges from the inputs and reasoning steps that directly determined it.
3. **No orphan reasoning**: Every `reasoning` node has at least one incoming and one outgoing edge in the graph.

## Contract

- **Immutable**: Once emitted, a decision graph is append-only; nodes and edges are not updated or deleted.
- **Trace-bound**: Each graph is bound to exactly one trace ID (reasoning or decision trace).
- **Query**: Systems may query by trace_id, domain, timestamp range, or artifact_ref to reconstruct graphs for audit or replay.
