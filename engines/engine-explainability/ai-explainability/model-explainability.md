# Model Explainability

## Definition

**Model explainability** is the representation of how a specific model (version, type) produces explainable outputs: explanation type (feature contribution, decision path, attention, etc.), content structure, and narrative. It is derived from ECOL AI explainability (ai-observability/ai-explainability.md)—without altering model or inference logic.

## Schema

```yaml
model_explainability_id: string
trace_id: string
inference_ref: string
model_id: string
model_version: string | null
model_type: enum [classifier | regressor | recommender | embedding | generative | hybrid]
generated_at: ISO8601
locale: string

# Explanation type
explanation_type: enum [feature_contribution | decision_path | attention | surrogate | native]
explanation_type_readable: string  # e.g. "Feature contributions (SHAP)"

# Content (structure depends on explanation_type)
feature_contributions: map | null  # feature name -> contribution
feature_contributions_readable: list of { feature_name, contribution, contribution_readable } | null
decision_path: list | null  # path from root to leaf (node ids or conditions)
decision_path_readable: string | null  # e.g. "Path: income > 50k -> tier_1"
attention_weights: map | null  # e.g. token -> weight
attention_weights_readable: string | null
surrogate_ref: string | null
native_explanation_ref: string | null

# Prediction
prediction_confidence: float | null
uncertainty: float | null
prediction_readable: string | null  # e.g. "Approved with confidence 0.88"

# Summary
summary: string  # human-readable summary of model explanation
```

## Deterministic Rules

1. **Explanation type readable**: explanation_type_readable = f(explanation_type, locale); deterministic (e.g. feature_contribution → "Feature contributions (SHAP)" when source is SHAP).
2. **Feature contributions readable**: feature_contributions_readable = list of { feature_name, contribution, f(contribution, locale) }; ordered by |contribution| descending; deterministic.
3. **Decision path readable**: decision_path_readable = f(decision_path, locale); template from path nodes/conditions; deterministic.
4. **Summary**: summary = f(explanation_type_readable, feature_contributions_readable or decision_path_readable or attention_weights_readable, prediction_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL AI explainability (ai-observability/ai-explainability.md), inference flow (output, confidence).
- **Output**: model_explainability with explanation_type, content (enriched with readable), summary.
- **Rules**: Content structure from ECOL; readable variants from cognition-to-language mapping; governance/explainability-standards may require minimum explanation type per model type.

## Contract

- Model explainability is read-only over ECOL AI explainability; no change to model or explainer code.
- model_explainability_id is immutable; inference_ref and model_id are required for audit.
- Best-effort when model does not support explanation type; document supported types per model in catalog; governance may require certification per model type (governance/explainability-certification.md).
