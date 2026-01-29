# Trace Mapping

## Definition

This document defines how ECOL trace types (reasoning, decision, execution, failure, recovery) map to each other and to platform trace IDs for correlation and query—without altering engine or tracing behavior.

## Trace Type Correlation

| ECOL trace type | Primary key | Correlates with |
|-----------------|-------------|-----------------|
| reasoning | trace_id | decision_trace (same trace_id), execution_trace (same trace_id), cognition_run |
| decision | trace_id | reasoning_trace (same trace_id), execution_trace (same trace_id) |
| execution | trace_id | reasoning_trace, decision_trace (same trace_id) |
| failure | trace_id | original_trace_id (request trace), recovery_trace (trace_id or trigger_ref) |
| recovery | trace_id | original_trace_id, trigger_ref (failure_id or trace_id) |

**Rule**: For a single request/run, reasoning_trace, decision_trace, and execution_trace share the same trace_id when possible. Failure and recovery traces may have their own trace_id and link via original_trace_id and trigger_ref.

## Cross-Reference Fields

| From | To | Field |
|------|-----|-------|
| reasoning_trace | decision_graph | decision_graph_ref |
| decision_trace | reasoning_trace | reasoning_trace_ref |
| decision_trace | decision_graph | decision_graph_ref |
| failure_trace | recovery_trace | recovery_trace_ref (from recovery trace: trigger_ref = failure trace) |
| recovery_trace | original trace | original_trace_id |
| execution_trace span | cognitive | cognitive_ref, cognitive_type (step_id, decision_id, flow_id) |

## Query Patterns

1. **Full cognitive view for request**: Query by trace_id; retrieve reasoning_trace, decision_trace, decision_graph, execution_trace (spans with cognitive_ref).
2. **Failure and recovery**: Query failure_trace by trace_id or original_trace_id; query recovery_trace by trigger_ref = failure_trace.trace_id or primary_failure_id.
3. **Replay/audit**: Query by trace_id; retrieve all trace types and decision_graph for timeline and audit artifact.

## Propagation Rules

1. **Single trace_id per request**: Platform should use one trace_id for the request so that reasoning, decision, and execution correlate by default.
2. **Failure/recovery trace_id**: Failure and recovery may use same trace_id as request (append failure/recovery to same trace) or dedicated trace_id with original_trace_id set.
3. **Immutable refs**: Once a trace references another (e.g. decision_graph_ref), that ref is immutable; no update of trace content.

## Contract

- Trace mapping is declarative; implementation of correlation and query is in storage and API layer.
- Engine does not depend on trace_id format; ECOL and platform agree on trace_id allocation (e.g. from OTEL TraceId or platform request id).
