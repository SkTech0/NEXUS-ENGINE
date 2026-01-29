# Risk Model (Explainability)

## Definition

The **risk model** for explainability is the representation of risk (score, tier, type) and its effect on a decision in a form suitable for human interpretation. It is derived from ECOL risk flow and decision context—without altering engine logic.

## Risk Explanation Structure

```yaml
risk_explanation_id: string
trace_id: string
target_ref: string  # decision_id, output_ref, entity_id
generated_at: ISO8601
locale: string

# Risk
risk_score: float | null  # [0,1]
risk_tier: string | null  # e.g. low, medium, high
risk_type: string | null  # e.g. fraud, credit, compliance
risk_source: enum [rule | model | policy | aggregation] | null
risk_readable: string  # e.g. "Risk tier: Medium (fraud)"
risk_interpretation: string | null  # e.g. "Triggered review path"

# Effect on decision
effect: enum [escalate | refer | deny | allow | mitigate] | null
effect_readable: string | null  # e.g. "Risk led to manual review"
evidence_ref: string | null

# Propagation (optional)
input_risk_refs: string[]
propagated_from_readable: string | null
```

## Deterministic Rules

1. **Interpretation**: risk_interpretation = f(risk_tier, risk_type, effect); deterministic template.
2. **Effect readable**: effect_readable = f(effect, risk_tier, locale); deterministic.
3. **Readable**: risk_readable = f(risk_score, risk_tier, risk_type, locale); deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL risk flow events for target_ref; ECOL decision flow (outcome, branch) for effect.
- **Output**: risk_explanation with risk fields, effect, and generated readable/interpretation.
- **Rules**: See mappings/trace-to-explanation.md; risk tier thresholds from governance.

## Contract

- Risk explanation is read-only over ECOL risk flow; no change to risk computation or decision logic.
- risk_explanation_id is immutable; target_ref and trace_id are required for audit.
