# Observability

## Components

- **Prometheus** (`infra/observability/prometheus.yml`): Scrape engine-api, node, otel-collector
- **Grafana** (`infra/observability/grafana/dashboards/`): Engine overview, trust & health
- **OTEL Collector** (`infra/observability/otel-collector.yml`): OTLP → Prometheus + Jaeger
- **Jaeger** (`infra/observability/jaeger.yml`): Tracing
- **Fluent Bit** (`infra/observability/fluentbit.conf`): Logs, trace/correlation IDs → Loki

## Metrics

- `nexus_engine_inference_latency_seconds`
- `nexus_engine_optimization_latency_seconds`
- `nexus_engine_trust_scoring_latency_seconds`
- `http_request_duration_seconds`, `http_requests_total`

## Logging

- Structured JSON with `trace_id`, `correlation_id`
- Fluent Bit parsers: `infra/observability/parsers.conf`

## Alerts

- `infra/observability/alerts.yml`: EngineApiDown, HighRequestLatency, engine latency alerts
