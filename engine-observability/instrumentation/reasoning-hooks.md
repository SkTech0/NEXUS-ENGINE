# Reasoning Hooks (Declarative Instrumentation)

## Definition

**Reasoning hooks** are the points at which reasoning observability attaches: before/after reasoning steps, inference flow start/end, and step conclusion. This document defines WHERE and HOW to attach—declarative only; no code changes to reasoning logic.

## Design Principles

1. **Additive only**: Hooks observe and emit; they do not modify inputs, outputs, or control flow of reasoning.
2. **Declarative**: Location and payload are specified; implementation (interceptor, aspect, callback) is separate.
3. **No mocks**: Hooks emit real step data from real execution.

## Hook Points

### REAS-1: Reasoning Step Start

**Location**: At the entry of a reasoning step (rule evaluation, constraint check, inference call, aggregation, delegation, fallback).

**When**: Before the step executes; after inputs are bound.

**Payload (emit)**:
- step_id, trace_id, sequence, timestamp
- reasoning_type (rule_based | constraint_satisfaction | inference | aggregation | delegation | fallback)
- domain, component
- input_refs (optional; if available at start)
- rule_ref, constraint_refs, model_ref (optional)

**Source model**: cognition/reasoning-model.md (reasoning step schema).

**Implementation note**: Allocate step_id; obtain sequence from trace context. Do not block step execution.

---

### REAS-2: Reasoning Step End

**Location**: At the exit of a reasoning step (after conclusion is produced).

**When**: After the step completes; before result is consumed by next step or decision.

**Payload (emit)**:
- step_id, trace_id, sequence, timestamp, duration_ms
- reasoning_type, input_refs, output_ref, conclusion (type or ref)
- confidence, uncertainty_reason (optional)
- parent_steps, child_steps (optional; may be derived from trace)
- rule_ref, constraint_refs, model_ref (optional)

**Source model**: cognition/reasoning-model.md.

**Implementation note**: Correlate by step_id; emit output_ref and conclusion. No change to step logic.

---

### REAS-3: Inference Flow Start

**Location**: At the entry of an inference unit (rule engine run, model invocation, hybrid inference).

**When**: Before input binding or preprocessing.

**Payload (emit)**:
- flow_id, trace_id
- inference_type (rule_engine | deterministic_model | stochastic_model | hybrid)
- model_ref, rule_set_ref (optional)
- input_artifact_refs (optional)

**Source model**: cognition/inference-flow.md.

**Implementation note**: Allocate flow_id; emit once per inference run.

---

### REAS-4: Inference Flow Stage

**Location**: At the boundary of each inference stage (input_binding, preprocessing, inference, postprocessing, conclusion).

**When**: After each stage completes.

**Payload (emit)**:
- flow_id, trace_id, stage_id, stage_name, started_at, ended_at
- input_refs, output_ref, duration_ms
- metadata (optional)

**Source model**: cognition/inference-flow.md (stages).

**Implementation note**: Append to flow; do not change stage logic.

---

### REAS-5: Inference Flow End

**Location**: At the exit of an inference unit (after conclusion is produced).

**When**: After postprocessing or conclusion stage.

**Payload (emit)**:
- flow_id, trace_id
- output_artifact_ref, confidence, uncertainty (optional)
- inference_type, model_ref

**Source model**: cognition/inference-flow.md.

**Implementation note**: Correlate by flow_id; emit output_artifact_ref for decision graph linkage.

---

## Attachment Contract

- **Where**: Entry/exit of reasoning step; entry/exit and stage boundaries of inference flow.
- **How**: Interceptor or callback that reads step/flow context and emits to ECOL backend. No change to rule engine, constraint solver, or model inference.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op; reasoning behavior is unchanged.
