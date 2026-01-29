# Inference Flow Model

## Definition

**Inference flow** is the path of data and control through inference steps: from inputs and model parameters to intermediate representations and final conclusions. This model defines how to observe and trace that flow without altering inference logic.

## Flow Stages

| Stage | Description | Observable |
|-------|-------------|------------|
| **Input binding** | Inputs bound to model or rule parameters | binding_spec, input_refs |
| **Preprocessing** | Transformations before inference | transform_ref, pre_output_ref |
| **Inference** | Core inference (rule engine or model) | model_ref, inference_type, duration_ms |
| **Postprocessing** | Normalization, thresholding, rounding | transform_ref, post_output_ref |
| **Conclusion** | Final output of this inference | conclusion_ref, confidence |

## Inference Flow Schema

```yaml
flow_id: string
trace_id: string
inference_type: enum [rule_engine | deterministic_model | stochastic_model | hybrid]
model_ref: string | null
rule_set_ref: string | null

stages: list of:
  stage_id: string
  stage_name: enum [input_binding | preprocessing | inference | postprocessing | conclusion]
  started_at: ISO8601
  ended_at: ISO8601 | null
  input_refs: string[]
  output_ref: string | null
  duration_ms: number | null
  metadata: map (optional)

input_artifact_refs: string[]
output_artifact_ref: string
confidence: [0,1] | null
uncertainty: string | null
```

## Data Flow Constraints

1. **Lineage**: Each stage’s `output_ref` may be used as `input_ref` in the next stage or in parallel branches.
2. **Single conclusion**: The flow has exactly one `output_artifact_ref` for the final conclusion of this inference unit.
3. **No cycles within flow**: Stages form a DAG; cycles indicate iterative inference and are modeled as separate flow instances or a dedicated loop construct.

## Relationship to AI Observability

- When `inference_type` is `stochastic_model` or `hybrid`, the flow aligns with `ai-observability/model-influence.md` and `inference-impact.md`.
- `model_ref` links to the model identity for contribution and explainability.

## Propagation Rules

1. **Trace continuity**: All stages share the same `trace_id`; `flow_id` is a sub-unit of the trace.
2. **Timing**: Stage `started_at`/`ended_at` must be non-overlapping in sequence or explicitly parallel (sibling stages).
3. **Attribution**: Every stage has at least one `input_ref` except `input_binding`, which has external `input_artifact_refs`.

## Contract

- Inference flow is emitted when an inference boundary is crossed (see instrumentation).
- Business logic of inference is unchanged; only inputs, stages, and output refs are recorded.
- Correlation with decision graph: the flow’s `output_artifact_ref` corresponds to a node in the decision graph (reasoning or output node).
