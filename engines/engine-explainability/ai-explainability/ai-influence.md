# AI Influence Explainability

## Definition

**AI influence explainability** is the representation of how AI output influenced a decision or outcome: influence type, effect (gate, weight, threshold), and narrative. It is derived from ECOL AI influence and decision flow—without altering engine logic.

## Schema

```yaml
ai_influence_explanation_id: string
trace_id: string
target_ref: string  # decision_id or output_ref
model_id: string
model_version: string | null
inference_ref: string
generated_at: ISO8601
locale: string

# Influence
influence_type: enum [direct | indirect | default]
effect: string | null  # e.g. "gate", "weight", "threshold"
effect_readable: string  # e.g. "Model score used as primary input to decision"
decision_branch_affected: string | null  # e.g. "approve", "refer"
contribution: float | null  # [0,1]
contribution_readable: string | null

# Output used
output_type: enum [score | label | embedding | text | structured]
output_value_readable: string | null  # e.g. "Score 0.72" (no PII)
output_ref: string

# Summary
summary: string  # human-readable summary of AI influence on this decision
```

## Deterministic Rules

1. **Effect readable**: effect_readable = f(influence_type, effect, decision_branch_affected, locale); deterministic template (e.g. direct + gate → "Model score used as gate; request allowed").
2. **Contribution readable**: contribution_readable = f(contribution, locale); deterministic when contribution is set.
3. **Output value readable**: output_value_readable = f(output_type, output_ref, locale); value or label only; no PII; deterministic.
4. **Summary**: summary = f(effect_readable, contribution_readable, output_value_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL AI influence (influence/ai-influence.md), decision flow (branch_taken, outcome_ref), inference flow (output_artifact_ref).
- **Output**: ai_influence_explanation with influence_type, effect, effect_readable, contribution, output_value_readable, summary.
- **Rules**: effect and decision_branch_affected from ECOL decision flow; contribution from ECOL AI influence; output_value_readable from ECOL output (sanitized).

## Contract

- AI influence explanation is read-only over ECOL; no change to decision or model logic.
- ai_influence_explanation_id is immutable; target_ref and inference_ref are required for audit.
- output_value_readable must not contain PII (governance/explainability-policy.md).
