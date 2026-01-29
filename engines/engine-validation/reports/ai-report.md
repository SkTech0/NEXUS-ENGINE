# AI Correctness Report

## Purpose

Summarizes AI correctness validation: model stability, drift detection, sensitivity, confidence calibration. No engine or model logic modification.

## Components

- **DeterminismEngine**: Same input → same model output (regression).
- **ConsistencyEngine**: Baseline vs current (drift); custom equality for tolerance (sensitivity).
- **InvariantEngine**: Confidence in [0,1]; prediction_confidence when present (calibration).

## Test Locations

- ai/regression-tests/regression.spec.ts
- ai/drift-tests/drift.spec.ts
- ai/sensitivity-tests/sensitivity.spec.ts
- ai/calibration-tests/calibration.spec.ts

## Spec

- ai/ai.spec.md

## Contract

- All tests use validators only; no model or engine execute() logic is modified.
