# AI Reasoning Explainability

## Definition

**AI reasoning explainability** is the representation of how AI/ML contributed to reasoning: model invocation, input binding, inference path, and conclusion in a form suitable for human interpretation. It is derived from ECOL inference flow and reasoning trace—without altering model or inference logic.

## Schema

```yaml
ai_reasoning_explanation_id: string
trace_id: string
inference_ref: string  # flow_id from ECOL
target_ref: string  # decision_id or output_ref this AI reasoning fed
generated_at: ISO8601
locale: string

# Model
model_id: string
model_version: string | null
model_type: enum [classifier | regressor | recommender | embedding | generative | hybrid]
model_readable: string  # e.g. "Credit risk classifier v2.1"

# Inference path (from ECOL inference flow)
stages: list of:
  stage_name: enum [input_binding | preprocessing | inference | postprocessing | conclusion]
  stage_readable: string  # e.g. "Input binding", "Inference"
  input_refs: string[]
  output_ref: string | null
  duration_ms: number | null

# Conclusion
conclusion_ref: string  # output_artifact_ref from ECOL
conclusion_readable: string  # e.g. "Risk score 0.72"
conclusion_type: enum [score | label | embedding | text | structured]

# Summary
summary: string  # human-readable summary of AI reasoning path
stage_count: integer
```

## Deterministic Rules

1. **Model readable**: model_readable = f(model_id, model_version, model_type, locale); deterministic (catalog or template).
2. **Stage readable**: stage_readable = f(stage_name, locale); deterministic (e.g. input_binding → "Input binding").
3. **Conclusion readable**: conclusion_readable = f(conclusion_type, conclusion_ref, locale); deterministic (value or label from ECOL; no PII in narrative).
4. **Summary**: summary = f(model_readable, stages (with stage_readable), conclusion_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL inference flow (cognition/inference-flow.md), reasoning trace (step with reasoning_type=inference, model_ref).
- **Output**: ai_reasoning_explanation with stages (enriched with stage_readable), conclusion_readable, summary.
- **Rules**: Each ECOL inference flow stage maps to one stage in ai_reasoning_explanation; conclusion_readable from output_artifact_ref and type.

## Contract

- AI reasoning explanation is read-only over ECOL inference flow; no change to model or inference code.
- ai_reasoning_explanation_id is immutable; inference_ref and target_ref are required for audit.
