# Causality Model

## Definition

**Causality** in ECOL is the relationship where one observable event or state is a direct or indirect cause of another. The model defines how cause-effect pairs are identified, stored, and queried for cognitive observability—without inferring causality from correlation alone where not defined by the engine.

## Cause-Effect Schema

```yaml
causality_id: string
trace_id: string

cause_type: enum [input | reasoning_step | decision | state_change | failure | external]
cause_ref: string  # artifact_id, step_id, decision_id, etc.
cause_timestamp: ISO8601
cause_domain: string

effect_type: enum [reasoning_step | decision | output | state_change | failure | recovery]
effect_ref: string
effect_timestamp: ISO8601
effect_domain: string

strength: enum [direct | indirect | inferred]
evidence: string | null  # reference to rule, code path, or explicit attribution
```

## Structural Rules

1. **Temporal order**: `cause_timestamp <= effect_timestamp` for direct and indirect; inferred may relax for logical time.
2. **Ref validity**: `cause_ref` and `effect_ref` must resolve to observable entities (trace nodes, artifacts, state snapshots).
3. **Strength semantics**:
   - **direct**: Engine explicitly attributes effect to cause (e.g. rule fired, decision branch taken).
   - **indirect**: Effect is downstream in a known dependency chain from cause.
   - **inferred**: Derived from trace structure or correlation; must be tagged and used with care in audit.

## Causality Graph

- **Nodes**: Observable entities (inputs, steps, decisions, outputs, state changes, failures).
- **Edges**: Cause-effect pairs with `strength` and `evidence`.
- **Properties**: Acyclic for direct/indirect within a single trace; cycles only if feedback is explicitly modeled (e.g. iterative refinement).

## Propagation Rules

1. **Transitivity**: If A→B (direct/indirect) and B→C (direct/indirect), then A→C is valid as indirect for query/visualization; store only explicit or one-hop where possible to avoid redundancy.
2. **No creation**: Causality edges are created only by instrumentation or by defined derivation from existing trace/graph data.
3. **Audit**: For audit and replay, only direct and indirect with evidence should be treated as causal; inferred is explanatory only unless policy defines otherwise.

## Contract

- Causality is additive: recording a cause-effect pair does not change engine behavior.
- Correlation is defined separately in `correlation.md`; causality is stricter (temporal + attribution or dependency).
- Integration: causality edges can be mapped to span links or events in OTEL (see integration/otel-mapping.md).
