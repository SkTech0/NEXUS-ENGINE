# Observability

- **prometheus.yml** — Scrape engine-api, node, otel-collector. Use with `alerts.yml`.
- **grafana/dashboards/** — Engine overview, trust & health.
- **otel-collector.yml** — OTLP → Prometheus + Jaeger. Metrics: `nexus_*`.
- **jaeger.yml** — All-in-one Jaeger (memory storage). UI: `:16686`.
- **fluentbit.conf** — Structured logging, trace/correlation IDs. Forward → Loki/stdout.

## Metrics (engine-api / OTEL)

- `nexus_engine_inference_latency_seconds` — AI inference latency
- `nexus_engine_optimization_latency_seconds` — Optimization latency
- `nexus_engine_trust_scoring_latency_seconds` — Trust scoring latency
- `http_request_duration_seconds` — API latency
- `http_requests_total` — Request counts

## Logging

Use structured JSON logs with `trace_id` and `correlation_id` in middleware. Fluent Bit parses and forwards to Loki.
