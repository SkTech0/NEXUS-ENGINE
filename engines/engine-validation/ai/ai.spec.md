# AI Correctness Spec

## Objective

Validate model stability, sensitivity to input, hallucination control, confidence calibration, drift detection, and output consistency. No modification of engine or model logic.

## Dimensions

1. **Regression**: Same input → same output (DeterminismEngine); output structure (ConsistencyEngine).
2. **Drift**: Baseline vs current output (ConsistencyEngine); custom equality for tolerance.
3. **Sensitivity**: Small input change → bounded output change (ConsistencyEngine with tolerance).
4. **Calibration**: Confidence in [0,1] (InvariantEngine); prediction_confidence when present.

## Test Locations

- `ai/regression-tests/regression.spec.ts`
- `ai/drift-tests/drift.spec.ts`
- `ai/sensitivity-tests/sensitivity.spec.ts`
- `ai/calibration-tests/calibration.spec.ts`

## Contracts

- All tests use validators only; no model or engine execute() logic is modified.
