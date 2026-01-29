# Trust Influence Model

## Definition

**Trust influence** is the effect of trust scores (and related signals) on decisions and downstream behavior. This model defines how trust propagates and how it influences outcomes for observability and governance.

## Trust Influence Schema

```yaml
influence_id: string
trace_id: string

trust_source: enum [input_trust | entity_trust | model_trust | system_trust]
source_ref: string  # entity_id, model_id, or component id
trust_score: [0,1] | null
trust_dimension: string | null  # e.g. data_quality, model_reliability

influenced_ref: string  # decision_id, step_id, or output_ref
influence_type: enum [gate | weight | threshold | override]
effect: enum [allowed | denied | reduced_weight | increased_weight | default_used]
```

## Trust Source Types

| Source | Description | Ref |
|--------|-------------|-----|
| **input_trust** | Trust in incoming data or request | input_ref |
| **entity_trust** | Trust in entity (e.g. customer trust score) | entity_id |
| **model_trust** | Trust in model or AI output | model_id |
| **system_trust** | Trust in upstream or external system | system_id |

## Influence Type (Semantics)

- **gate**: Trust was used as a gate (e.g. below threshold → deny or fallback).
- **weight**: Trust modulated the weight of another input (e.g. low trust → down-weight).
- **threshold**: Trust compared to threshold to choose branch.
- **override**: Trust triggered override (e.g. human review, default).

## Propagation Rules

1. **Temporal**: Trust influence is recorded when a decision or step is affected by a trust score; source_ref must have a trust score at or before that time.
2. **Effect**: Every trust influence record has an effect; allows audit of “why was this denied?” (e.g. low entity_trust → denied).
3. **Flow**: Trust flow over time is modeled in flows/trust-flow.md; trust influence is the point-in-time impact.

## Relationship to Trust Model

- trust-confidence/trust-model.md defines trust scores and dimensions; this document defines how trust influences specific decisions/steps.
- Trust flow (flows/trust-flow.md) describes how trust values move through the system; trust influence is the consumption of those values.

## Contract

- Trust influence is recorded when a trust score is read and used to gate, weight, or override.
- Additive only; no change to how trust is computed or applied in business logic.
