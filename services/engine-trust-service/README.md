# engine-trust-service

Independent Trust service with signal-driven confidence.

## Responsibility

- Exposes: `/api/Trust/verify`, `/api/Trust/score/{id}`, `/api/Trust/health`, `/health`
- Trust confidence computed from platform signals (self-health, dependency readiness, optional engine probes)
- See [TRUST_CONFIDENCE.md](TRUST_CONFIDENCE.md) for design and extensibility

## Optional: probe engine health

Set `TRUST_PROBE_URLS` (comma-separated) to probe engine health and factor into confidence:

```
TRUST_PROBE_URLS=https://engine-ai.example.com/health,https://engine-data.example.com/health
```

## Local run

```bash
python run.py
```
Default port: 5014.
