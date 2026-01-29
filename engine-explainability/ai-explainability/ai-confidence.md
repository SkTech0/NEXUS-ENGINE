# AI Confidence Explainability

## Definition

**AI confidence explainability** is the representation of model-level confidence (e.g. classifier probability, calibration) in a form suitable for human interpretation. It is derived from ECOL inference flow and AI influence—without altering model or inference logic.

## Schema

```yaml
ai_confidence_explanation_id: string
trace_id: string
inference_ref: string
target_ref: string  # decision_id or output_ref
model_id: string
model_version: string | null
generated_at: ISO8601
locale: string

# Confidence
prediction_confidence: float  # [0,1] from model output
confidence_source: enum [model_native | post_hoc | calibration]
confidence_readable: string  # e.g. "Model confidence 0.88"
confidence_interpretation: string | null  # e.g. "High confidence"
calibration_ref: string | null  # link to calibration or uncertainty info

# Thresholds (when applicable)
threshold_used: float | null  # e.g. 0.5 for binary
threshold_readable: string | null  # e.g. "Above decision threshold 0.5"

# Summary
summary: string  # human-readable summary of AI confidence
```

## Deterministic Rules

1. **Confidence readable**: confidence_readable = f(prediction_confidence, confidence_source, locale); deterministic template.
2. **Confidence interpretation**: confidence_interpretation = f(prediction_confidence, thresholds); thresholds from governance; deterministic (e.g. [0,0.5)=Low, [0.5,0.8)=Medium, [0.8,1]=High).
3. **Threshold readable**: threshold_readable = f(threshold_used, locale); deterministic when threshold_used is set.
4. **Summary**: summary = f(confidence_readable, confidence_interpretation, threshold_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL inference flow (output confidence), AI influence (prediction_confidence), optional calibration_ref.
- **Output**: ai_confidence_explanation with prediction_confidence, confidence_readable, confidence_interpretation, summary.
- **Rules**: See mappings/trace-to-explanation.md; interpretation thresholds from governance/explainability-standards.

## Contract

- AI confidence explanation is read-only over ECOL; no change to model or inference code.
- ai_confidence_explanation_id is immutable; inference_ref and target_ref are required for audit.
