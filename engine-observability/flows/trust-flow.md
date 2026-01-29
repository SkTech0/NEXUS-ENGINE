# Trust Flow Model

## Definition

**Trust flow** is the propagation of trust scores (and updates) through the engine—inputs, entities, models, and decisions. This model defines how trust is observed over time for cognitive observability.

## Trust Flow Schema

```yaml
trust_event_id: string
trace_id: string
sequence: integer
timestamp: ISO8601

ref_type: enum [input | entity | model | system | decision]
ref_id: string

trust_score: float  # [0,1]
trust_dimension: string | null  # e.g. data_quality, model_reliability
source: enum [computed | policy | human | default]

# Propagation
input_trust_refs: string[]  # prior trust events that fed this
propagated_to: string[]     # ref_ids that consumed this trust
effect: enum [gate | weight | threshold | override] | null  # when consumed
```

## Ref Types (Semantics)

| Ref type | Description | Ref_id |
|----------|-------------|--------|
| **input** | Incoming request or data | input_ref |
| **entity** | Persistent entity (e.g. customer) | entity_id |
| **model** | AI/ML model | model_id |
| **system** | Upstream or external system | system_id |
| **decision** | Decision that used trust | decision_id |

## Propagation Rules

1. **Monotonic sequence**: sequence is monotonic per trace.
2. **Ref binding**: Every trust event is attached to a ref.
3. **Effect**: When trust is consumed by a decision, effect (gate, weight, threshold, override) can be recorded at the consumer (see influence/trust-influence.md).
4. **Flow**: input_trust_refs and propagated_to form a flow graph of trust through the system.

## Relationship to Other Models

- **Trust model**: trust-confidence/trust-model.md defines trust semantics; this document defines flow events.
- **Trust influence**: influence/trust-influence.md defines how trust affects decisions; trust flow is the supply side.

## Contract

- Trust flow events are emitted when trust is computed or updated and when it is consumed (at instrumentation boundaries).
- Additive only; no change to trust computation or application logic.
