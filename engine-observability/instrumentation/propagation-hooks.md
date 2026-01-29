# Propagation Hooks (Declarative Instrumentation)

## Definition

**Propagation hooks** are the points at which propagation observability attaches: when influence, state, failure, recovery, confidence, or trust propagates from source to sink. This document defines WHERE and HOW to attach—declarative only; no code changes to propagation logic.

## Design Principles

1. **Additive only**: Hooks observe and emit; they do not modify propagation behavior.
2. **Declarative**: Location and payload are specified; implementation is separate.
3. **No mocks**: Hooks emit real propagation data from real execution.

## Hook Points

### PROP-1: Influence Propagation

**Location**: When a decision, output, or component result is consumed by a downstream step or decision.

**When**: After producer emits; when consumer reads (or at consumer entry).

**Payload (emit)**:
- propagation_id, trace_id
- propagation_type=influence
- source_type, source_ref, source_timestamp
- sink_type, sink_ref, sink_timestamp
- payload_ref (optional), magnitude (optional), hop, path (optional)

**Source model**: causality/propagation.md.

**Implementation note**: Emit when downstream step/decision is entered and input_refs include producer ref. No change to data flow.

---

### PROP-2: State Propagation

**Location**: When state change (e.g. cache, config) is propagated to a component or step.

**When**: After state update; when consumer reads state.

**Payload (emit)**:
- propagation_id, trace_id
- propagation_type=state
- source_type, source_ref, source_timestamp
- sink_type, sink_ref, sink_timestamp
- payload_ref (state diff or ref), magnitude (optional), hop

**Source model**: causality/propagation.md.

**Implementation note**: Emit at state read boundary when state was recently updated. No change to state management.

---

### PROP-3: Failure Propagation (Cascade)

**Location**: When a failure causes another failure (cascade).

**When**: When downstream component or step fails due to upstream failure (at failure detection).

**Payload (emit)**:
- propagation_id, trace_id
- propagation_type=failure
- source_type, source_ref (failure_id or ref), source_timestamp
- sink_type, sink_ref, sink_timestamp
- payload_ref (optional), magnitude (optional), hop, path (optional)

**Source model**: causality/propagation.md, failures/cascade-model.md.

**Implementation note**: Emit when failure is detected and cause_ref or parent_failure_id is set. No change to error propagation logic.

---

### PROP-4: Recovery Propagation

**Location**: When a recovery action or signal affects a component or state.

**When**: After recovery action completes; when component receives recovery signal.

**Payload (emit)**:
- propagation_id, trace_id
- propagation_type=recovery
- source_type, source_ref (recovery action id), source_timestamp
- sink_type, sink_ref, sink_timestamp
- payload_ref (optional), hop

**Source model**: causality/propagation.md.

**Implementation note**: Emit at recovery action end when target is updated. No change to recovery logic.

---

### PROP-5: Confidence / Trust Propagation (Optional)

**Location**: When confidence or trust value is passed from one step/decision to another.

**When**: When consumer reads confidence/trust from producer (or at consumer entry).

**Payload (emit)**:
- propagation_id, trace_id
- propagation_type=confidence | trust
- source_type, source_ref, source_timestamp
- sink_type, sink_ref, sink_timestamp
- payload_ref (optional), magnitude (optional), hop

**Source model**: causality/propagation.md, flows/confidence-flow.md, flows/trust-flow.md.

**Implementation note**: Optional; use when confidence/trust flow visualization is needed. No change to confidence/trust computation.

---

## Attachment Contract

- **Where**: Consumer entry when producer ref is in input_refs; failure detection with cause_ref; recovery action end; optional confidence/trust read.
- **How**: Interceptor or callback that detects producer-consumer or cause-effect and emits propagation event. No change to propagation logic.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op; propagation behavior is unchanged.
