# Metric Mapping

## Definition

This document defines how ECOL concepts can be exposed as metrics for dashboards and alerting—without altering engine or metrics behavior. ECOL is not metrics-first; this mapping is for platforms that want to aggregate cognitive observability into counters, gauges, or histograms.

## Principle

- ECOL is not metrics. Metrics remain unchanged.
- When ECOL events are emitted, they may optionally be aggregated into metrics (e.g. decision count by domain, confidence histogram, failure rate by component).
- Metric mapping is optional; primary ECOL storage is trace/graph; metrics are derived views.

## Suggested Metrics (Declarative)

| Metric name | Type | Description | Labels |
|-------------|------|-------------|--------|
| ecol_reasoning_steps_total | Counter | Count of reasoning steps | trace_id (optional), domain, reasoning_type |
| ecol_decisions_total | Counter | Count of decisions | trace_id (optional), domain, decision_type, outcome_type |
| ecol_confidence | Histogram or Gauge | Confidence values | domain, ref_type (step \| decision \| output) |
| ecol_trust_score | Gauge | Trust score (last or sample) | ref_type, domain |
| ecol_failures_total | Counter | Count of failures | domain, failure_type, component |
| ecol_recovery_actions_total | Counter | Count of recovery actions | action_type, outcome |
| ecol_fallback_total | Counter | Count of fallbacks taken | fallback_type, domain |
| ecol_inference_duration_seconds | Histogram | Inference flow duration | model_id, inference_type |
| ecol_decision_graph_size | Histogram or Gauge | Nodes or edges in decision graph | domain |

**Rule**: Prefix ecol_ for ECOL-derived metrics to avoid collision with existing application metrics.

## Aggregation Rules

1. **Counters**: Increment on event (e.g. decision made, failure occurred); labels from event (domain, type).
2. **Gauges**: Set or sample (e.g. last confidence for a ref); use when point-in-time value is needed.
3. **Histograms**: Observe value on event (e.g. confidence, duration); buckets are implementation-defined.
4. **No high cardinality**: Avoid trace_id or step_id as label unless metric backend supports high cardinality; prefer domain, component, type.

## Propagation Rules

1. **No metric requirement**: ECOL does not require metrics; this mapping applies when platform aggregates ECOL events into metrics.
2. **Additive**: Metric mapping adds ecol_* metrics; it does not change existing application metrics.
3. **Sampling**: Metrics may be sampled (e.g. 1% of traces); document sampling policy; full audit remains in ECOL storage.

## Relationship to Dashboards

- Dashboards may use ecol_* metrics for “cognitive health” (e.g. decision rate, failure rate, fallback rate, confidence distribution).
- ECOL is not a dashboard layer; dashboards consume metrics that are derived from ECOL events per this mapping.

## Contract

- Metric mapping is declarative; implementation of metric emission is in instrumentation or metrics adapter (e.g. OTEL metrics exporter).
- Engine and existing metrics are unchanged; ECOL metrics are derived from ECOL events at hook points only.
