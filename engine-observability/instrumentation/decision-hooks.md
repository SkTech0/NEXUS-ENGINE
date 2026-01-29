# Decision Hooks (Declarative Instrumentation)

## Definition

**Decision hooks** are the points at which decision observability attaches: before/after decision evaluation, branch selection, and outcome emission. This document defines WHERE and HOW to attach—declarative only; no code changes to decision logic.

## Design Principles

1. **Additive only**: Hooks observe and emit; they do not modify inputs, branch selection, or outcome.
2. **Declarative**: Location and payload are specified; implementation is separate.
3. **No mocks**: Hooks emit real decision data from real execution.

## Hook Points

### DEC-1: Decision Start

**Location**: At the entry of a decision point (binary, multi-way, continuous, delegation, fallback).

**When**: Before decision evaluation; after inputs are available.

**Payload (emit)**:
- decision_id, trace_id, sequence, timestamp
- decision_type (binary | multi_way | continuous | delegation | fallback)
- domain, component
- input_refs (optional)
- context_ref (optional)

**Source model**: flows/decision-flow.md, states/decision-state.md (status=in_progress).

**Implementation note**: Allocate decision_id; obtain sequence from trace. Do not block decision.

---

### DEC-2: Decision End (Outcome)

**Location**: At the exit of a decision point (after outcome is determined).

**When**: After branch selection or outcome computation; before outcome is consumed downstream.

**Payload (emit)**:
- decision_id, trace_id, sequence, timestamp
- decision_type, input_refs, outcome_ref, outcome_type, branch_taken
- parent_decision_id, child_decision_ids (optional)
- domain, component

**Source model**: flows/decision-flow.md, states/decision-state.md (status=completed).

**Implementation note**: Emit outcome_ref and branch_taken. No change to decision logic.

---

### DEC-3: Decision Graph Node (Optional)

**Location**: When building or emitting decision graph; may be derived from reasoning and decision events or emitted at decision end.

**When**: At decision end (or batch after run) when graph is materialized.

**Payload (emit)**:
- node_id (= decision_id or output node), node_type (decision_point | output)
- trace_id, timestamp, domain, artifact_ref, confidence, trust_score (optional)
- edges: from input/reasoning nodes to this node (depends_on, influenced_by)

**Source model**: cognition/decision-graph.md.

**Implementation note**: Graph may be built incrementally (emit node and edges at decision end) or in batch from reasoning + decision events. No change to decision logic.

---

### DEC-4: Decision State Transition

**Location**: When decision status changes (pending → in_progress → completed | failed | delegated).

**When**: At status change.

**Payload (emit)**:
- state_id, trace_id, timestamp, decision_id, status
- input_refs, outcome_ref, outcome_type (when completed)
- failure_ref (when failed), child_decision_ids (when delegated)

**Source model**: states/decision-state.md, states/transition-model.md (state_type=decision_status).

**Implementation note**: Emit transition for audit trail; no change to state machine.

---

## Attachment Contract

- **Where**: Entry/exit of decision point; optional graph node emission; decision state transition.
- **How**: Interceptor or callback that reads decision context and outcome; emits to ECOL backend. No change to decision evaluation or branch selection.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op; decision behavior is unchanged.
