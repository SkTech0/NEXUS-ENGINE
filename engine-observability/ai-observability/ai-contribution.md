# AI Contribution Model

## Definition

**AI contribution** is the measurable contribution of AI/ML components to a decision or outcome. This model defines how AI contribution is quantified and attributed for observability and governance—without altering model or inference logic.

## AI Contribution Schema

```yaml
contribution_id: string
trace_id: string
timestamp: ISO8601

# AI source
model_id: string
model_version: string | null
inference_ref: string  # link to inference flow or span

# Target
target_type: enum [decision | output | reasoning_step]
target_ref: string

# Contribution
contribution: float  # [0,1] normalized contribution to outcome
contribution_type: enum [direct | indirect | default]
output_used: string | null  # model output that was used (e.g. score, label)

# Explainability (optional)
feature_contributions: map | null  # feature name -> contribution (e.g. SHAP)
prediction_confidence: [0,1] | null
```

## Contribution Type (Semantics)

| Type | Description |
|------|-------------|
| **direct** | Model output was the primary input to the decision |
| **indirect** | Model output was used in an intermediate step that fed the decision |
| **default** | Model output was used as default or fallback |

## Propagation Rules

1. **Trace binding**: contribution is always for a trace_id and target_ref.
2. **Inference link**: inference_ref links to full inference flow (cognition/inference-flow.md) for full traceability.
3. **Feature contributions**: When available (model or post-hoc), feature_contributions support “which inputs drove the model?” explainability.

## Relationship to Other Models

- **AI influence**: influence/ai-influence.md is the influence record; AI contribution is the same concept with emphasis on quantification and attribution.
- **Model influence**: ai-observability/model-influence.md details model-level influence.
- **Inference impact**: ai-observability/inference-impact.md details inference-level impact.
- **Explainability**: trust-confidence/explainability.md contribution_breakdown includes ai contributor type.

## Contract

- AI contribution is recorded when model output is consumed by a decision or step (at instrumentation boundary); no change to model or inference code.
- contribution normalization (sum across contributors ≤ 1) is implementation or policy-defined.
