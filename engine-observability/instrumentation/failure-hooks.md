# Failure Hooks (Declarative Instrumentation)

## Definition

**Failure hooks** are the points at which failure observability attaches: when a failure is detected, when it propagates (cascade), and when degradation or fallback occurs. This document defines WHERE and HOW to attach—declarative only; no code changes to error handling or propagation logic.

## Design Principles

1. **Additive only**: Hooks observe and emit; they do not modify error handling, retry, or propagation.
2. **Declarative**: Location and payload are specified; implementation is separate.
3. **No mocks**: Hooks emit real failure data from real execution.

## Hook Points

### FAIL-1: Failure Detected

**Location**: When an error, timeout, violation, or resource failure is detected (exception handler, timeout handler, validation failure, policy denial).

**When**: At the point of detection; before or after error is propagated to caller.

**Payload (emit)**:
- failure_id, trace_id, timestamp (see failures/failure-model.md)
- failure_type (error | timeout | violation | resource | policy), severity
- ref (span_id, step_id, component_id), message, code (optional)
- cause_ref (optional; parent failure if cascaded), propagation_hop (0 = root)
- component, domain (optional)

**Source model**: failures/failure-model.md, traces/failure-trace.md.

**Implementation note**: Allocate failure_id; set cause_ref and propagation_hop when failure is due to upstream. No change to error handling.

---

### FAIL-2: Failure Cascade (Propagation)

**Location**: When a downstream component or step fails as a result of an upstream failure.

**When**: At failure detection when cause is known (e.g. upstream exception, timeout).

**Payload (emit)**:
- cascade_id, trace_id (see failures/cascade-model.md)
- source_failure_id, target_ref, target_failure_id (optional), hop, timestamp
- path (optional)

**Source model**: failures/cascade-model.md, causality/propagation.md (type=failure).

**Implementation note**: Emit when FAIL-1 is emitted with cause_ref; or emit cascade edge when downstream failure is detected and linked to parent. No change to propagation logic.

---

### FAIL-3: Degradation Detected

**Location**: When degradation is observed (fallback active, reduced accuracy, latency, partial availability, capacity limited).

**When**: At degradation detection or when fallback path is entered.

**Payload (emit)**:
- degradation_id, trace_id, timestamp (see failures/degradation-model.md)
- degradation_type, scope, ref, trigger_ref (optional), message, severity
- effect_on_cognition (optional), fallback_path_ref (optional)

**Source model**: failures/degradation-model.md.

**Implementation note**: Emit when mode changes to degraded or when fallback is active. No change to degradation or fallback logic.

---

### FAIL-4: Fallback Taken

**Location**: When a fallback path is selected and used (cache, default, alternate service, human review, reject).

**When**: After fallback path is chosen; before or after fallback outcome is produced.

**Payload (emit)**:
- fallback_id, trace_id, timestamp (see failures/fallback-model.md)
- trigger_type, trigger_ref, primary_path_ref
- fallback_path_id, fallback_path_name, fallback_type
- outcome_ref (optional; at end), outcome_status (optional), confidence_impact (optional)

**Source model**: failures/fallback-model.md.

**Implementation note**: Emit when fallback is taken; optionally emit outcome at fallback end. No change to fallback selection or execution.

---

## Attachment Contract

- **Where**: Error/timeout/violation detection; cascade link when cause_ref is set; degradation detection; fallback entry (and optional exit).
- **How**: Interceptor or callback in error path, timeout handler, or fallback entry; reads failure context and emits to ECOL backend. No change to error handling, retry, or fallback logic.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op; failure behavior is unchanged.
