# Health Checks

- **health-checks.py** — Liveness, readiness, startup probes. Usage:
  - `HEALTH_MODE=liveness ENGINE_API_URL=http://localhost:5000 python health-checks.py`
  - `HEALTH_MODE=readiness` / `HEALTH_MODE=startup` / `HEALTH_MODE=all`
- **system-check.py** — Basic system info (Python, platform, cwd).
- **dependency-check.py** — engine-api, node, dotnet. Set `SKIP_ENGINE_API_CHECK=1` to skip API.

## Kubernetes probes

```yaml
livenessProbe:
  exec:
    command: ["python", "health/health-checks.py"]
  env:
    - name: HEALTH_MODE
      value: liveness
    - name: ENGINE_API_URL
      value: http://localhost:5000
  initialDelaySeconds: 10
  periodSeconds: 10
readinessProbe:
  exec:
    command: ["python", "health/health-checks.py"]
  env:
    - name: HEALTH_MODE
      value: readiness
startupProbe:
  exec:
    command: ["python", "health/health-checks.py"]
  env:
    - name: HEALTH_MODE
      value: startup
  failureThreshold: 30
  periodSeconds: 5
```
