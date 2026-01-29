# Trust Hooks (Declarative Instrumentation)

## Definition

**Trust hooks** are the points at which trust observability attaches: when trust is computed, updated, or consumed (gate, weight, threshold, override). This document defines WHERE and HOW to attach—declarative only; no code changes to trust logic.

## Design Principles

1. **Additive only**: Hooks observe and emit; they do not modify trust scores or how trust is applied.
2. **Declarative**: Location and payload are specified; implementation is separate.
3. **No mocks**: Hooks emit real trust data from real execution.

## Hook Points

### TRUST-1: Trust Computed or Updated

**Location**: At the exit of trust computation (entity trust, input trust, model trust, system trust).

**When**: After trust score is produced or updated; before it is stored or consumed.

**Payload (emit)**:
- trust_event_id, trace_id, sequence, timestamp
- ref_type (input | entity | model | system), ref_id
- trust_score, trust_dimension (optional), source (computed | policy | human | default)
- input_trust_refs (optional), propagated_to (optional; when consumed)

**Source model**: trust-confidence/trust-model.md, flows/trust-flow.md.

**Implementation note**: Emit when trust is computed or updated. No change to trust computation.

---

### TRUST-2: Trust Consumed (Gate, Weight, Threshold, Override)

**Location**: When a decision or step reads trust and uses it (gate, weight, threshold, override).

**When**: At decision/step entry when trust is an input; or at branch selection when trust determined branch.

**Payload (emit)**:
- influence_id, trace_id (see influence/trust-influence.md)
- trust_source, source_ref, trust_score, trust_dimension
- influenced_ref (decision_id or step_id)
- influence_type (gate | weight | threshold | override), effect (allowed | denied | reduced_weight | increased_weight | default_used)

**Source model**: influence/trust-influence.md, flows/trust-flow.md (effect, propagated_to).

**Implementation note**: Emit when trust is read and applied. No change to decision or step logic.

---

### TRUST-3: Trust Flow Update (Optional)

**Location**: When trust is propagated to downstream (e.g. entity trust used in decision).

**When**: When consumer receives trust value (same as TRUST-2 or when trust is passed along).

**Payload (emit)**:
- trust_event_id, trace_id, sequence, timestamp
- ref_type, ref_id, trust_score, trust_dimension, source
- input_trust_refs, propagated_to, effect (optional)

**Source model**: flows/trust-flow.md.

**Implementation note**: May be combined with TRUST-1/TRUST-2; emit when trust flows to another ref. No change to flow logic.

---

## Attachment Contract

- **Where**: Exit of trust computation; entry of decision/step when trust is consumed; optional flow update.
- **How**: Interceptor or callback that reads trust value and consumer ref; emits to ECOL backend. No change to trust computation or application.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op; trust behavior is unchanged.
