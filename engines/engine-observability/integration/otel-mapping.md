# OpenTelemetry Mapping

## Definition

This document defines how ECOL concepts map to OpenTelemetry (OTEL) traces, spans, and attributes so that cognitive observability can be correlated with existing distributed tracing—without altering engine or OTEL behavior.

## Trace ID Mapping

| ECOL | OTEL |
|------|------|
| trace_id (reasoning, decision, execution) | TraceId (hex 32 chars) |
| trace_id (failure, recovery) | TraceId (same as request trace when linked) or dedicated TraceId |

**Rule**: When the platform uses OTEL, ECOL trace_id should be set to or from OTEL TraceId for the same request/run so that cognitive and execution views correlate.

## Span Mapping

| ECOL concept | OTEL |
|--------------|------|
| reasoning step | Span (name e.g. "reasoning.step", attributes: step_id, reasoning_type, domain) |
| decision | Span (name e.g. "decision", attributes: decision_id, decision_type, outcome_ref) |
| inference flow | Span (name e.g. "inference", attributes: flow_id, model_id, inference_type) |
| data flow stage | Span (name e.g. "data.stage", attributes: stage_id, stage_type, artifact_ref) |
| recovery action | Span (name e.g. "recovery.action", attributes: action_id, action_type) |

**Rule**: Spans are created by existing or ECOL instrumentation; ECOL adds attributes (cognitive_ref, cognitive_type, domain, step_id, decision_id, etc.) per execution-trace.md.

## Attribute Mapping (ECOL → OTEL Span Attributes)

| ECOL field | OTEL attribute name | Type |
|------------|---------------------|------|
| step_id | ecol.step_id | string |
| decision_id | ecol.decision_id | string |
| flow_id | ecol.flow_id | string |
| domain | ecol.domain | string |
| cognitive_type | ecol.cognitive_type | string (reasoning \| decision \| inference \| data_flow) |
| artifact_ref | ecol.artifact_ref | string |
| trace_id (ECOL) | ecol.trace_id | string (if different from OTEL TraceId) |

**Rule**: Prefix ecol. for ECOL-specific attributes to avoid collision with existing OTEL semantics.

## Event Mapping (ECOL → OTEL Span Events)

| ECOL event | OTEL Span Event |
|------------|-----------------|
| state transition | Event(name="ecol.state_transition", attributes: from_state, to_state, entity_ref) |
| confidence update | Event(name="ecol.confidence", attributes: ref_id, confidence) |
| trust update | Event(name="ecol.trust", attributes: ref_id, trust_score) |
| failure | Event(name="ecol.failure", attributes: failure_id, failure_type, ref) |
| fallback taken | Event(name="ecol.fallback", attributes: fallback_id, fallback_path_id) |

**Rule**: ECOL events are added as Span Events when instrumentation emits them; attributes follow ECOL schema field names with ecol. prefix where needed.

## Link Mapping (ECOL causality → OTEL Span Links)

| ECOL | OTEL |
|------|------|
| cause_ref → effect_ref (causality) | SpanLink(Context of cause span, attributes: ecol.causal_effect_ref=effect_ref) |
| parent_failure_id → failure_id (cascade) | SpanLink(Context of parent failure span, attributes: ecol.cascade_child_ref=failure_id) |

**Rule**: Causality and cascade can be represented as Span Links when cause and effect have span context; ECOL causality_id or failure_id can be stored in link attributes.

## Propagation Rules

1. **No OTEL dependency**: ECOL can operate without OTEL; this mapping is for platforms that use OTEL. When OTEL is absent, ECOL uses its own trace_id and does not emit spans.
2. **Additive attributes**: ECOL only adds attributes and events; it does not remove or override existing OTEL attributes.
3. **Sampling**: OTEL sampling may drop spans; ECOL-critical data (e.g. decision outcome) may also be stored in ECOL storage for full audit; mapping does not require all cognitive spans to be unsampled.

## Contract

- This document is declarative; implementation of span creation and attribute emission is in instrumentation layer and backend.
- Engine and OTEL SDK behavior are unchanged; ECOL instrumentation adds attributes and events at defined hook points.
