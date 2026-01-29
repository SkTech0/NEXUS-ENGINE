# Dependency and Influence Model

## Definition

**Dependency** is a requirement relationship: B depends on A if A must be available or evaluated before B. **Influence** is a contribution relationship: A influences B if A’s output or state contributed to B’s outcome. This document defines how dependency and influence are modeled together for cognitive observability.

## Dependency Schema

```yaml
dependency_id: string
trace_id: string

dependent_ref: string  # B
depends_on_ref: string  # A
dependency_type: enum [data | control | temporal | resource]
strength: enum [hard | soft]
evidence: string | null  # e.g. data flow, API call, schedule
```

## Influence Schema

```yaml
influence_id: string
trace_id: string

influencer_ref: string  # A
influenced_ref: string  # B
influence_type: enum [data | rule | constraint | ai | trust | optimization]
weight: float | null  # [0,1] or normalized contribution
direction: enum [positive | negative | neutral]
evidence: string | null
```

## Relationship Between Dependency and Influence

- **Dependency implies ordering**: If B depends on A, then A is observed before B. Dependency does not state how much A influenced B.
- **Influence does not imply dependency**: A can influence B (e.g. default value) even if B does not strictly depend on A (e.g. A was optional).
- **Both together**: For a full picture, record dependency for ordering and correctness, and influence for attribution and explainability.

## Combined Graph

- **Dependency graph**: Directed graph of depends_on_ref → dependent_ref. Must be acyclic for a single execution.
- **Influence graph**: Directed graph of influencer_ref → influenced_ref. May have cycles (e.g. iterative refinement).
- **Unified view**: Nodes are observability entities; edges are typed (dependency vs influence) with attributes above.

## Propagation Rules

1. **Dependency transitivity**: If C depends on B and B depends on A, then C transitively depends on A; recording direct dependencies is sufficient for graph construction.
2. **Influence aggregation**: Multiple influencers on one node can be aggregated by weight for contribution breakdown (see trust-confidence/explainability.md).
3. **No cross-trace dependency**: Dependency edges are within one trace unless explicitly modeling cross-request dependency (e.g. shared cache); then use trace_ref or global scope.

## Contract

- Dependency and influence are recorded additively at instrumentation boundaries.
- Engine logic does not depend on these records; they are for analysis, audit, and visualization.
- Detailed influence types (engine, data, AI, trust, optimization) are expanded in influence/*.md.
