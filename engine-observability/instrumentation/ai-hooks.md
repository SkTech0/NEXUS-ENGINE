# AI Hooks (Declarative Instrumentation)

## Definition

**AI hooks** are the points at which AI observability attaches: before/after inference, when model output is consumed, and when AI explanation is produced. This document defines WHERE and HOW to attach—declarative only; no code changes to model or inference logic.

## Design Principles

1. **Additive only**: Hooks observe and emit; they do not modify model inputs, outputs, or inference.
2. **Declarative**: Location and payload are specified; implementation is separate.
3. **No mocks**: Hooks emit real inference and contribution data from real execution.

## Hook Points

### AI-1: Inference Start (Model Invocation)

**Location**: At the entry of model invocation (before input binding or preprocessing).

**When**: Before inference; align with cognition/inference-flow.md flow start.

**Payload (emit)**:
- flow_id, trace_id (see cognition/inference-flow.md)
- inference_type, model_id, model_version, model_type (optional)
- input_artifact_refs (optional)

**Source model**: cognition/inference-flow.md, ai-observability/inference-impact.md.

**Implementation note**: Reuse or align with REAS-3 (inference flow start). No change to inference.

---

### AI-2: Inference End (Model Output)

**Location**: At the exit of model invocation (after conclusion is produced).

**When**: After inference; before output is consumed downstream.

**Payload (emit)**:
- flow_id, trace_id, output_artifact_ref, confidence, uncertainty (optional)
- model_id, model_version, model_type
- inference_type
- feature_contributions (optional; if model or explainer provides)
- prediction_confidence (optional)

**Source model**: cognition/inference-flow.md, influence/ai-influence.md, ai-observability/ai-contribution.md.

**Implementation note**: Emit output_artifact_ref for decision graph linkage. No change to inference.

---

### AI-3: AI Output Consumed (Contribution)

**Location**: When a decision or reasoning step consumes model output.

**When**: At decision/step entry when model output is in input_refs; or at outcome when outcome was determined by model.

**Payload (emit)**:
- influence_id, trace_id (see influence/ai-influence.md)
- model_id, model_version, model_type, inference_ref
- influenced_ref (decision_id or step_id), contribution (optional), output_type
- feature_contributions (optional), prediction_confidence (optional)

**Source model**: influence/ai-influence.md, ai-observability/ai-contribution.md, ai-observability/inference-impact.md (consumers list).

**Implementation note**: Emit when model output is read and used. No change to decision or step logic.

---

### AI-4: AI Explanation (Optional)

**Location**: When model or post-hoc explainer produces explanation (feature contribution, decision path, etc.).

**When**: After inference (or in separate explainer call); before or with AI-2.

**Payload (emit)**:
- explanation_id, trace_id, inference_ref
- model_id, model_version, explanation_type (feature_contribution | decision_path | attention | surrogate | native)
- feature_contributions, decision_path, attention_weights (optional per type)
- prediction_confidence, uncertainty (optional)

**Source model**: ai-observability/ai-explainability.md.

**Implementation note**: Optional; emit when explainer is invoked. No change to model or explainer logic.

---

## Attachment Contract

- **Where**: Entry/exit of model invocation; consumer entry when model output is in inputs; optional explanation emission.
- **How**: Interceptor or callback that reads inference context and consumer refs; emits to ECOL backend. No change to model forward pass or inference.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op; AI behavior is unchanged.
