# Confidence Model (Explainability)

## Definition

The **confidence model** for explainability is the representation of confidence (and uncertainty) in an outcome or decision in a form suitable for human interpretation: score, source, aggregation method, and narrative. It is derived from ECOL confidence flow and confidence model—without altering engine logic.

## Confidence Explanation Structure

```yaml
confidence_explanation_id: string
trace_id: string
target_ref: string  # decision_id, output_ref, step_id
generated_at: ISO8601
locale: string

# Confidence
confidence: float  # [0,1]
confidence_source: enum [rule | model | aggregation | human | default]
aggregation_method: string | null  # when source = aggregation
confidence_readable: string  # e.g. "Confidence 0.85 from model output"
confidence_interpretation: string | null  # e.g. "High confidence"

# Uncertainty (optional)
uncertainty: float | null  # [0,1]
uncertainty_type: enum [aleatoric | epistemic | total] | null
uncertainty_readable: string | null
uncertainty_interpretation: string | null  # e.g. "Low uncertainty"

# Inputs (when aggregated)
input_confidence_refs: string[]  # prior confidence events that were combined
input_confidence_readable: string | null  # short summary of inputs
```

## Deterministic Rules

1. **Interpretation**: confidence_interpretation = f(confidence, thresholds); e.g. [0,0.5)=Low, [0.5,0.8)=Medium, [0.8,1]=High; thresholds are policy-defined (governance/explainability-standards).
2. **Uncertainty**: When uncertainty is present, uncertainty_interpretation = f(uncertainty, thresholds); deterministic.
3. **Readable**: confidence_readable and uncertainty_readable are from templates (locale + value + source); deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL confidence flow event or confidence model record for target_ref.
- **Output**: confidence_explanation with confidence, source, optional uncertainty, and generated readable/interpretation.
- **Rules**: See mappings/trace-to-explanation.md; interpretation thresholds from governance.

## Contract

- Confidence explanation is read-only over ECOL confidence; no change to confidence computation.
- confidence_explanation_id is immutable; target_ref and trace_id are required for audit.
