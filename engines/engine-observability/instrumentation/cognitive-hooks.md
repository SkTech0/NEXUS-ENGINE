# Cognitive Hooks (Declarative Instrumentation)

## Definition

**Cognitive hooks** are the points at which cognitive observability attaches to the engine: cognition run start/end, phase transitions, and state snapshots. This document defines WHERE and HOW to attach—declarative only; no code changes to engine logic.

## Design Principles

1. **Additive only**: Hooks are observation points; they do not modify control flow or business logic.
2. **Declarative**: This document specifies location and payload; implementation (e.g. interceptor, aspect, callback) is separate.
3. **No mocks**: Hooks emit real data from real execution; no fake or demo logic.

## Hook Points

### COG-1: Cognition Run Start

**Location**: At the entry of a cognitive run (request handler, event handler, or scheduled job that triggers reasoning and decision).

**When**: Before any ingestion or context assembly.

**Payload (emit)**:
- cognition_run_id
- trace_id
- started_at
- trigger (request | event | schedule | recovery)
- trigger_ref (optional)
- domain, component

**Source model**: cognition/cognition-model.md (cognition run schema).

**Implementation note**: Obtain trace_id from platform (e.g. OTEL TraceId or request id); allocate cognition_run_id. Emit once per run.

---

### COG-2: Cognition Run End

**Location**: At the exit of a cognitive run (after emission or before abort).

**When**: After all outputs emitted or when run is aborted.

**Payload (emit)**:
- cognition_run_id
- trace_id
- ended_at
- phases_completed
- input_count, reasoning_step_count, decision_point_count, output_count
- domain, component

**Source model**: cognition/cognition-model.md.

**Implementation note**: Emit once per run; correlate by cognition_run_id.

---

### COG-3: Phase Transition

**Location**: When cognitive phase changes (ingestion → context → reasoning → decision → emission).

**When**: Immediately after phase completion or at phase entry (policy-defined).

**Payload (emit)**:
- state_id or transition_id
- trace_id
- timestamp
- from_phase, to_phase (or current_phase)
- domain, component

**Source model**: states/transition-model.md (state_type=cognitive_phase), states/cognitive-state.md.

**Implementation note**: Emit at phase boundary; no change to phase logic.

---

### COG-4: Cognitive State Snapshot (Optional)

**Location**: At phase boundary or periodically within a run (e.g. every N steps).

**When**: Policy-defined (e.g. at end of reasoning phase, or every 10 steps).

**Payload (emit)**:
- state_id, trace_id, timestamp
- current_phase, phases_completed
- active_input_refs, active_context_refs, active_reasoning_step_ids, pending_decision_ids, produced_output_refs
- counts (optional)

**Source model**: states/cognitive-state.md.

**Implementation note**: Optional; use when state inspection is needed for debug or audit. Do not snapshot on every step if high volume.

---

## Attachment Contract

- **Where**: Entry/exit of cognitive run; phase transition boundaries; optional snapshot points.
- **How**: Interceptor, aspect, or callback that reads context (trace_id, phase, refs) and emits to ECOL backend. No change to run logic, phase logic, or state machine.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op or log; engine behavior is unchanged.
