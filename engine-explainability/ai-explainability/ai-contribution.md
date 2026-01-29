# AI Contribution Explainability

## Definition

**AI contribution explainability** is the representation of how much an AI/ML model contributed to an outcome: contribution score, output used, feature contributions (when available), and narrative. It is derived from ECOL AI influence and AI contribution—without altering model or inference logic.

## Schema

```yaml
ai_contribution_explanation_id: string
trace_id: string
target_ref: string  # decision_id or output_ref
model_id: string
model_version: string | null
inference_ref: string
generated_at: ISO8601
locale: string

# Contribution
contribution: float  # [0,1] normalized
contribution_type: enum [direct | indirect | default]
output_used: string | null  # model output that was used (e.g. score, label)
output_type: enum [score | label | embedding | text | structured]
contribution_readable: string  # e.g. "Model contributed 0.35 to this decision"
contribution_interpretation: string | null  # e.g. "Primary contributor"

# Feature contributions (when available)
feature_contributions: map | null  # feature name -> contribution (e.g. SHAP)
feature_contributions_readable: list of { feature_name, contribution, contribution_readable } | null
top_features_count: integer | null  # e.g. 5 for top 5
feature_contributions_summary: string | null  # e.g. "Top factor: income (0.42)"

# Confidence (model-level)
prediction_confidence: float | null  # [0,1]
prediction_confidence_readable: string | null

# Summary
summary: string  # human-readable summary of AI contribution
```

## Deterministic Rules

1. **Contribution readable**: contribution_readable = f(contribution, contribution_type, model_id, locale); deterministic template.
2. **Contribution interpretation**: contribution_interpretation = f(contribution, rank among contributors); e.g. rank 1 → "Primary contributor"; deterministic.
3. **Feature contributions readable**: feature_contributions_readable = list of { feature_name, contribution, f(contribution, locale) }; ordered by contribution descending; top_features_count limits list; deterministic.
4. **Summary**: summary = f(contribution_readable, feature_contributions_summary, prediction_confidence_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL AI influence (influence/ai-influence.md), AI contribution (ai-observability/ai-contribution.md), optional feature_contributions from model or post-hoc explainer.
- **Output**: ai_contribution_explanation with contribution, output_used, feature_contributions_readable (if available), summary.
- **Rules**: contribution from ECOL; feature_contributions from ECOL or explainer; normalization consistent with EEL contribution model.

## Contract

- AI contribution explanation is read-only over ECOL AI influence; no change to model or inference code.
- feature_contributions are best-effort (model-dependent); document source (e.g. SHAP, LIME) in metadata; governance/explainability-standards may require minimum explainability per model type.
