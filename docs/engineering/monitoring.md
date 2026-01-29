# Monitoring

## Health Checks

- **Liveness**: `health/health-checks.py` `HEALTH_MODE=liveness`
- **Readiness**: `HEALTH_MODE=readiness` (Health + Engine)
- **Startup**: `HEALTH_MODE=startup`
- **System**: `health/system-check.py`
- **Dependencies**: `health/dependency-check.py`

## Probes

- Use `health-checks.py` for Kubernetes liveness/readiness/startup probes (see `health/README.md`).

## Dashboards

- Grafana: Engine overview, Trust & Health (`infra/observability/grafana/dashboards/`)

## Alerts

- Prometheus rules: `infra/observability/alerts.yml`
