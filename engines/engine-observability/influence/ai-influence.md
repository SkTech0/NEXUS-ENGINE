# AI Influence Model

## Definition

**AI influence** is the contribution of AI/ML components (models, embeddings, recommendations) to decisions and outputs. This model defines how to attribute outcomes to AI for explainability, governance, and audit.

## AI Influence Schema

```yaml
influence_id: string
trace_id: string

model_id: string
model_version: string | null
model_type: enum [classifier | regressor | recommender | embedding | generative | hybrid]
inference_ref: string  # link to inference flow or span

influenced_ref: string  # decision_id, step_id, or output_ref
contribution: float | null  # [0,1] normalized contribution to outcome
output_type: enum [score | label | embedding | text | structured]

# Explainability
feature_contributions: map | null  # feature name -> contribution (e.g. SHAP, LIME)
prediction_confidence: [0,1] | null
calibration_ref: string | null  # link to calibration or uncertainty info
```

## Model Types (Semantics)

| Type | Description | Typical output |
|------|-------------|----------------|
| **classifier** | Classification | label, score per class |
| **regressor** | Regression | numeric value |
| **recommender** | Ranking or recommendation | ranked list, scores |
| **embedding** | Vector representation | embedding ref |
| **generative** | Text or structured generation | text or structured |
| **hybrid** | Multiple sub-models | composite output |

## Propagation Rules

1. **One inference_ref per influence**: Each AI influence record links to one inference flow or span for full traceability.
2. **Feature contributions**: When available (model or post-hoc explainer), feature_contributions map input features to contribution; can feed explainability views.
3. **Confidence**: prediction_confidence is the model’s own confidence when exposed; distinct from engine-level confidence in trust-confidence/confidence-model.md.

## Relationship to AI Observability

- AI influence is the “contribution” view; ai-observability/ covers full AI observability (model influence, inference impact, explainability).
- Cross-reference model-influence.md and inference-impact.md for inference-level detail.

## Contract

- AI influence is recorded when an AI output is consumed by a decision or reasoning step.
- Recording is at boundary (after inference, when result is used); no change to model or inference code.
- When feature_contributions are present, they are best-effort (model-dependent); document source (e.g. SHAP, LIME, native) in metadata.
