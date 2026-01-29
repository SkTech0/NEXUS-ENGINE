# Reliability Report

*Engine flow, chaos, health checks.*

## Checks

- Engine flow: `scripts/test-engine-flow.sh`
- Chaos: `scripts/chaos-test.sh`
- Health: `health/health-checks.py`

## Gates

- Engine flow must pass
- Health OK, no cascading failure (see `quality/reliability-rules.yml`)
