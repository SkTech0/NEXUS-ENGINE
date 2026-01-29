# AI Uncertainty Explainability

## Definition

**AI uncertainty explainability** is the representation of model-level uncertainty (aleatoric, epistemic, or total) in a form suitable for human interpretation. It is derived from ECOL uncertainty model and inference flow—without altering model or inference logic.

## Schema

```yaml
ai_uncertainty_explanation_id: string
trace_id: string
inference_ref: string
target_ref: string  # decision_id or output_ref
model_id: string
model_version: string | null
generated_at: ISO8601
locale: string

# Uncertainty
uncertainty_type: enum [aleatoric | epistemic | total]
value: float  # [0,1] or domain-specific
unit: string | null  # e.g. probability, variance
source: enum [model_native | post_hoc | aggregation] | null
uncertainty_readable: string  # e.g. "Epistemic uncertainty 0.12"
uncertainty_interpretation: string | null  # e.g. "Low; model is certain"

# Relationship to confidence
confidence: float | null  # when complementary (e.g. 1 - value)
complementary: boolean  # true if confidence = 1 - value

# Summary
summary: string  # human-readable summary of AI uncertainty
```

## Deterministic Rules

1. **Uncertainty readable**: uncertainty_readable = f(uncertainty_type, value, unit, locale); deterministic template.
2. **Uncertainty interpretation**: uncertainty_interpretation = f(uncertainty_type, value, thresholds); thresholds from governance; deterministic (e.g. [0,0.2)=Low, [0.2,0.5)=Medium, [0.5,1]=High).
3. **Complementary**: When model provides both confidence and uncertainty, complementary = true if value = 1 - confidence (for total).
4. **Summary**: summary = f(uncertainty_readable, uncertainty_interpretation, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL uncertainty model (trust-confidence/uncertainty-model.md), inference flow (uncertainty field), AI explainability (ai-explainability.md).
- **Output**: ai_uncertainty_explanation with type, value, readable, interpretation, summary.
- **Rules**: See mappings/trace-to-explanation.md; interpretation thresholds from governance/explainability-standards.

## Contract

- AI uncertainty explanation is read-only over ECOL; no change to model or inference code.
- ai_uncertainty_explanation_id is immutable; inference_ref and target_ref are required for audit.
- Best-effort when model does not expose uncertainty; document limitation in metadata.
