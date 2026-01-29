# AI Explainability Model

## Definition

**AI explainability** is the structured representation of why an AI/ML model produced a given output: feature contributions, decision path (for trees), or other model-specific explanations. This model defines the structure for AI-specific explainability—without altering model or inference logic.

## AI Explanation Schema

```yaml
explanation_id: string
trace_id: string
inference_ref: string  # flow_id or span_id of inference
timestamp: ISO8601

# Model
model_id: string
model_version: string | null
explanation_type: enum [feature_contribution | decision_path | attention | surrogate | native]

# Content (structure depends on explanation_type)
feature_contributions: map | null  # feature name -> contribution (e.g. SHAP, LIME)
decision_path: list | null  # for tree-based: path from root to leaf (node ids or conditions)
attention_weights: map | null  # for attention-based: e.g. token -> weight
surrogate_ref: string | null  # reference to surrogate model or summary
native_explanation_ref: string | null  # model-native explanation (e.g. Integrated Gradients)

# Optional
prediction_confidence: [0,1] | null
uncertainty: float | null
locale: string | null
```

## Explanation Types (Semantics)

| Type | Description |
|------|-------------|
| **feature_contribution** | Per-feature contribution (SHAP, LIME, etc.) |
| **decision_path** | Path through tree or rule set |
| **attention** | Attention or importance weights |
| **surrogate** | Surrogate model (e.g. linear approximation) |
| **native** | Model-native explanation (e.g. Integrated Gradients) |

## Propagation Rules

1. **Inference binding**: Every AI explanation is for one inference_ref (one model invocation).
2. **Trace binding**: explanation is scoped to trace_id.
3. **Content**: Content structure is model- and explanation-type dependent; feature_contributions is the most common and should be a map (feature_name -> contribution).

## Relationship to Other Models

- **Explainability**: trust-confidence/explainability.md is general explainability; AI explainability is the AI-specific subset (contributor_type=ai, feature-level).
- **AI contribution**: ai-observability/ai-contribution.md may reference feature_contributions from this model.
- **Inference flow**: cognition/inference-flow.md is the inference run; inference_ref links to it.

## Contract

- AI explanations are produced by the model, a post-hoc explainer, or at instrumentation boundary; no change to model forward pass.
- Best-effort: not all models support all explanation types; document supported types per model in metadata or catalog.
