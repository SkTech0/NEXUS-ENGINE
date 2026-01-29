# Trust Decision Explainability

## Definition

**Trust decision explainability** is the representation of how trust (score, dimension) affected a decision: gate, weight, threshold, or override, and narrative. It is derived from ECOL trust influence and trust flow—without altering trust or decision logic.

## Schema

```yaml
trust_decision_explanation_id: string
trace_id: string
target_ref: string  # decision_id
generated_at: ISO8601
locale: string

# Trust
trust_ref: string  # input_ref, entity_id, model_id
trust_source: enum [input_trust | entity_trust | model_trust | system_trust]
trust_source_readable: string  # e.g. "Entity trust"
trust_score: float  # [0,1]
trust_dimension: string | null  # e.g. data_quality
trust_readable: string  # e.g. "Trust 0.72 (data quality)"

# Effect on decision
effect: enum [gate | weight | threshold | override]
effect_outcome: enum [allowed | denied | reduced_weight | increased_weight | default_used]
effect_readable: string  # e.g. "Trust gate passed; request allowed"
evidence_ref: string | null
threshold_used: float | null  # when effect = gate or threshold
threshold_readable: string | null  # e.g. "Threshold 0.5"

# Summary
summary: string  # human-readable summary of trust impact on decision
```

## Deterministic Rules

1. **Trust source readable**: trust_source_readable = f(trust_source, locale); deterministic.
2. **Trust readable**: trust_readable = f(trust_score, trust_dimension, trust_ref, locale); deterministic template.
3. **Effect readable**: effect_readable = f(effect, effect_outcome, trust_score, threshold_used, locale); deterministic (e.g. gate + allowed → "Trust gate passed; request allowed").
4. **Summary**: summary = f(trust_readable, effect_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL trust influence (influence/trust-influence.md), trust flow (flows/trust-flow.md) for target_ref.
- **Output**: trust_decision_explanation with trust, effect, effect_readable, summary.
- **Rules**: See mappings/trace-to-explanation.md; thresholds from governance.

## Contract

- Trust decision explanation is read-only over ECOL trust; no change to trust or decision logic.
- trust_decision_explanation_id is immutable; target_ref and trust_ref are required for audit.
