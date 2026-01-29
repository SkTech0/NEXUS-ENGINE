# Inference Impact Model

## Definition

**Inference impact** is the effect of a single inference run (model invocation) on downstream decisions and outcomes. This model defines how to trace from one inference to its consumers for observability—without altering inference logic.

## Inference Impact Schema

```yaml
impact_id: string
trace_id: string
inference_ref: string  # flow_id or span_id of inference
timestamp: ISO8601

# Inference
model_id: string
model_version: string | null
inference_type: enum [rule_engine | deterministic_model | stochastic_model | hybrid]
output_ref: string  # artifact produced by inference

# Impact (downstream consumers)
consumers: list of:
  consumer_type: enum [decision | reasoning_step | output]
  consumer_ref: string
  contribution: float | null  # [0,1] contribution of this inference to consumer
  path: string | null  # e.g. "direct", "via_step_123"
```

## Propagation Rules

1. **Inference binding**: Every impact record is for one inference_ref (one inference run).
2. **Consumers**: consumers list all downstream decisions, steps, or outputs that used this inference output; contribution is optional.
3. **Trace binding**: impact is scoped to trace_id; inference and consumers are in the same trace or linked trace.

## Relationship to Other Models

- **Inference flow**: cognition/inference-flow.md defines the inference run; inference_ref links to flow_id.
- **AI contribution**: ai-observability/ai-contribution.md is per decision/outcome; inference impact is per inference (one-to-many to consumers).
- **Decision graph**: inference output_ref and consumer_refs map to nodes in decision graph; inference impact is the “who consumed this inference?” view.

## Contract

- Inference impact is recorded when inference output is consumed (at instrumentation boundary) or derived from trace/graph; no change to inference code.
- consumers list can be built incrementally as downstream steps are observed.
