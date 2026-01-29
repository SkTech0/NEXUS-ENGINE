# Determinism Report

## Purpose

Summarizes determinism validation: same input → same output, replay consistency, snapshot consistency, golden output comparison. No engine logic modification.

## Components

- **DeterminismEngine**: Records runs (traceId, input, output, timestamp); validateForInput(input); validateAll().
- **ReplayRunner**: Loads records; replayAll() / replayForInput(); uses DeterminismEngine.
- **ConsistencyEngine**: validatePair, validatePairs, validateReplayOutputs for snapshot and golden tests.
- **Golden tests**: Compare actual output against known-good golden output (determinism/golden-tests).

## Test Locations

- determinism/replay-tests/replay.spec.ts
- determinism/snapshot-tests/snapshot.spec.ts
- determinism/golden-tests/golden.spec.ts

## Spec

- determinism/determinism.spec.md

## Contract

- All tests use validators and harnesses only; engine execute() is not modified.
