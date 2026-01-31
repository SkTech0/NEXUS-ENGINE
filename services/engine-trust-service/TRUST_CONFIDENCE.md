# Trust Confidence Engine

## Overview

Trust confidence is **computed from platform signals**, not constants. The Trust service aggregates health signals and produces a deterministic confidence score (0.0–1.0) used by LoanDecisionService, readiness probes, and product UI.

## Architecture

```
Request → SignalCollector.collect() → TrustSignal
                ↓
         TrustConfidenceEngine.compute() → ConfidenceResult
                ↓
         API response (health, score)
```

- **TrustSignal**: Immutable snapshot (self_healthy, dependency_readiness, engine_health, latency_timeout_observed)
- **TrustConfidenceEngine**: Deterministic, weighted scoring. Stateless.
- **SignalCollector**: Gathers signals at request time. Optional probe of TRUST_PROBE_URLS.

## How Confidence Is Derived

Weighted formula:

| Signal | Weight | Contribution |
|--------|--------|--------------|
| self_healthy | 0.35 | Service is running |
| dependency_readiness | 0.35 | Probed dependencies OK |
| engine_health_ratio | 0.25 | Fraction of healthy engines |
| !latency_timeout_observed | 0.05 | No probe timeouts |

When `TRUST_PROBE_URLS` is not set: `engine_health` is empty → `engine_health_ratio = 1.0`, `dependency_readiness = True`. Result: confidence ≈ 1.0.

When probes are configured and some fail: confidence degrades proportionally.

## Adding New Signals

1. Extend `TrustSignal` in `app/signals.py` with new fields (defaults for backward compat).
2. Update `SignalCollector.collect()` to populate the new field.
3. Update `TrustConfidenceEngine.compute()` to include the new signal in the weighted formula.
4. Adjust weights in `confidence_engine.py` if needed; keep `WEIGHT_SUM` normalized.

## Integration

- **LoanDecisionService**: Calls `GET /api/Trust/health`, reads `confidence`, feeds into `LoanRiskModel.ComputeRiskScore()`.
- **Engine API readiness**: Probes `GET /api/Trust/health`; gateway is ready when Trust responds OK.
- **Product UI**: Trust page and Risk & Trust views display confidence and indicators.

## Verify vs Confidence

`/api/Trust/verify` is **separate** from confidence. It will handle claim/token verification (identity, compliance) in a future phase. Confidence is purely about platform operational signals.
