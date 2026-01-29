# Uncertainty Model (Explainability)

## Definition

The **uncertainty model** for explainability is the representation of uncertainty (type, value, source) in an outcome or model output in a form suitable for human interpretation. It is derived from ECOL uncertainty model and confidence flow—without altering engine logic.

## Uncertainty Explanation Structure

```yaml
uncertainty_explanation_id: string
trace_id: string
target_ref: string  # decision_id, output_ref, step_id, model_id
generated_at: ISO8601
locale: string

# Uncertainty
uncertainty_type: enum [aleatoric | epistemic | total]
value: float  # [0,1] or domain-specific
unit: string | null  # e.g. probability, variance
source: enum [model | rule | aggregation | default] | null
uncertainty_readable: string  # e.g. "Epistemic uncertainty 0.15"
uncertainty_interpretation: string | null  # e.g. "Moderate; consider human review"

# Relationship to confidence (optional)
confidence: float | null  # [0,1] when complementary (e.g. 1 - uncertainty)
complementary: boolean  # true if confidence = 1 - value for total uncertainty

# Inputs (when aggregated)
input_uncertainty_refs: string[]
aggregation_method: string | null
```

## Deterministic Rules

1. **Interpretation**: uncertainty_interpretation = f(uncertainty_type, value, thresholds); thresholds from governance; deterministic.
2. **Readable**: uncertainty_readable = f(uncertainty_type, value, unit, locale); deterministic.
3. **Complementary**: When source provides both confidence and uncertainty, complementary = true if value = 1 - confidence (for total).

## Transformation (ECOL → EEL)

- **Input**: ECOL uncertainty model record or confidence flow event with uncertainty for target_ref.
- **Output**: uncertainty_explanation with type, value, and generated readable/interpretation.
- **Rules**: See mappings/trace-to-explanation.md; interpretation thresholds from governance.

## Contract

- Uncertainty explanation is read-only over ECOL uncertainty; no change to uncertainty computation.
- uncertainty_explanation_id is immutable; target_ref and trace_id are required for audit.
