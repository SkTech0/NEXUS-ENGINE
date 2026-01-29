# Recovery Hooks (Declarative Instrumentation)

## Definition

**Recovery hooks** are the points at which recovery observability attaches: when recovery is triggered, when recovery actions run (retry, fallback, compensation, self-heal, escalate), and when stabilization is reached. This document defines WHERE and HOW to attach—declarative only; no code changes to recovery logic.

## Design Principles

1. **Additive only**: Hooks observe and emit; they do not modify recovery, retry, or self-healing logic.
2. **Declarative**: Location and payload are specified; implementation is separate.
3. **No mocks**: Hooks emit real recovery data from real execution.

## Hook Points

### REC-1: Recovery Started

**Location**: When recovery is triggered (after failure or degradation is detected).

**When**: At the start of recovery flow; before first recovery action.

**Payload (emit)**:
- recovery_id, trace_id, started_at (see traces/recovery-trace.md, recovery/recovery-model.md)
- trigger_type (failure | degradation | timeout | policy), trigger_ref
- original_trace_id (optional)

**Source model**: traces/recovery-trace.md, recovery/recovery-model.md.

**Implementation note**: Allocate recovery_id; set trigger_ref to failure_id or event id. No change to recovery trigger logic.

---

### REC-2: Recovery Action (Retry, Fallback, Compensation, Self-Heal, Escalate)

**Location**: At the start or end of each recovery action.

**When**: At action start (optional) and at action end (required).

**Payload (emit)**:
- recovery_id, trace_id, action_id, sequence, timestamp
- action_type (retry | fallback | compensation | self_heal | escalate)
- target_ref, outcome (success | failure | partial), duration_ms (optional)
- metadata (optional)

**Source model**: traces/recovery-trace.md (actions), recovery/self-healing.md, recovery/compensation.md.

**Implementation note**: Emit at action end; optionally at action start. No change to action logic.

---

### REC-3: Recovery Ended (Stabilization)

**Location**: When recovery flow completes (recovered, degraded, or failed).

**When**: After last recovery action; when final outcome is determined.

**Payload (emit)**:
- recovery_id, trace_id, ended_at
- final_outcome (recovered | degraded | failed)
- stabilization_ref (optional; link to stabilization record)

**Source model**: traces/recovery-trace.md, recovery/recovery-model.md.

**Implementation note**: Emit when recovery flow exits. No change to outcome determination.

---

### REC-4: Stabilization Reached (Optional)

**Location**: When system is considered stable after recovery (normal or degraded state accepted).

**When**: When stability criteria are met (e.g. health check passed, circuit closed).

**Payload (emit)**:
- stabilization_id, recovery_trace_id, timestamp (see recovery/stabilization.md)
- outcome (recovered | degraded), state_ref (optional)
- criteria_met (optional), duration_since_trigger_ms (optional)

**Source model**: recovery/stabilization.md.

**Implementation note**: Emit when stabilization is declared. No change to stability logic.

---

### REC-5: Failure Recovery Link (Optional)

**Location**: When recovery is triggered by a failure; link failure trace to recovery trace.

**When**: At recovery start when trigger_ref is failure_id.

**Payload (emit)**:
- In failure record (failures/failure-model.md): recovery_trace_ref = recovery_id
- Or in recovery record: trigger_ref = failure_id

**Source model**: failures/failure-model.md (recovery_trace_ref), traces/recovery-trace.md (trigger_ref).

**Implementation note**: Update failure record with recovery_trace_ref or ensure recovery record has trigger_ref; no change to failure or recovery logic.

---

## Attachment Contract

- **Where**: Recovery flow start; recovery action start/end; recovery flow end; optional stabilization; optional failure-recovery link.
- **How**: Interceptor or callback in recovery flow and action boundaries; reads recovery context and emits to ECOL backend. No change to retry, fallback, compensation, or self-healing logic.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op; recovery behavior is unchanged.
