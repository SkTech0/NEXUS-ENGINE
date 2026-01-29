#!/bin/sh
# Run observability stack (Prometheus, Grafana, etc.) via Docker Compose.
# Usage: ./run-observability.sh
# Ensure infra/observability configs are used; compose file TBD.

set -e
cd "$(dirname "$0")"
echo "Observability config: infra/observability/"
echo "  - prometheus.yml, alerts.yml"
echo "  - grafana/dashboards/"
echo "  - otel-collector.yml, jaeger.yml, fluentbit.conf"
echo ""
echo "To run with Docker Compose, add infra/observability/docker-compose.yml"
echo "and run: docker compose -f infra/observability/docker-compose.yml up -d"
echo ""
echo "Standalone: start Prometheus with -config.file=infra/observability/prometheus.yml"
