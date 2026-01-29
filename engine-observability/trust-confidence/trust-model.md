# Trust Model

## Definition

**Trust** in ECOL is a score or signal representing the engine’s assessment of reliability of an entity, input, model, or system. This model defines trust structure for observability—without altering trust computation logic.

## Trust Score Schema

```yaml
trust_id: string
trace_id: string | null  # null if global trust (e.g. entity trust)
timestamp: ISO8601

ref_type: enum [input | entity | model | system]
ref_id: string  # input_ref, entity_id, model_id, system_id

trust_score: float  # [0,1]
trust_dimension: string | null  # e.g. data_quality, model_reliability, identity
source: enum [computed | policy | human | default]

# Optional
metadata: map
```

## Trust Dimensions (Examples)

| Dimension | Description |
|-----------|-------------|
| **data_quality** | Trust in quality of input data |
| **model_reliability** | Trust in model output |
| **identity** | Trust in identity or provenance |
| **system** | Trust in upstream or external system |

## Propagation Rules

1. **Ref binding**: Every trust score is attached to a ref (input, entity, model, or system).
2. **Trace binding**: When trust is request-scoped (e.g. input trust), trace_id is set; when global (e.g. entity trust), trace_id may be null.
3. **Flow**: Trust flow over time is in flows/trust-flow.md; trust influence on decisions is in influence/trust-influence.md.

## Relationship to Other Models

- **Trust flow**: flows/trust-flow.md defines how trust propagates over time.
- **Trust influence**: influence/trust-influence.md defines how trust affects decisions.
- **Confidence**: trust-confidence/confidence-model.md is distinct; confidence is about belief in outcome, trust is about reliability of source.

## Contract

- Trust scores are recorded when computed or updated (at instrumentation boundary); no change to trust computation logic.
- trust_score in [0,1]; interpretation (e.g. 0 = untrusted, 1 = fully trusted) is policy-defined.
