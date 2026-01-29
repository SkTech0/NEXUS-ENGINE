# Trust Model (Explainability)

## Definition

The **trust model** for explainability is the representation of trust (score, dimension, source) and its effect on a decision in a form suitable for human interpretation. It is derived from ECOL trust flow and trust influence—without altering engine logic.

## Trust Explanation Structure

```yaml
trust_explanation_id: string
trace_id: string
target_ref: string  # decision_id, input_ref, entity_id
generated_at: ISO8601
locale: string

# Trust
trust_score: float  # [0,1]
trust_dimension: string | null  # e.g. data_quality, model_reliability
trust_source: enum [computed | policy | human | default]
trust_ref: string  # input_ref, entity_id, model_id
trust_readable: string  # e.g. "Trust 0.72 (data quality)"
trust_interpretation: string | null  # e.g. "Above threshold; allowed"

# Effect on decision
effect: enum [gate | weight | threshold | override]
effect_outcome: enum [allowed | denied | reduced_weight | increased_weight | default_used]
effect_readable: string  # e.g. "Trust gate passed; request allowed"
evidence_ref: string | null
```

## Deterministic Rules

1. **Interpretation**: trust_interpretation = f(trust_score, trust_dimension, effect_outcome); deterministic template.
2. **Effect readable**: effect_readable = f(effect, effect_outcome, trust_score, locale); deterministic.
3. **Readable**: trust_readable = f(trust_score, trust_dimension, trust_ref, locale); deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL trust flow event and ECOL trust influence record for target_ref.
- **Output**: trust_explanation with trust fields, effect, and generated readable/interpretation.
- **Rules**: See mappings/trace-to-explanation.md; trust thresholds from governance.

## Contract

- Trust explanation is read-only over ECOL trust; no change to trust computation or application.
- trust_explanation_id is immutable; target_ref and trace_id are required for audit.
