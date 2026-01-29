# Determinism Validation Spec

## Objective

Ensure same input → same output, replay consistency, idempotency correctness, ordering guarantees, and state reproducibility. No modification of engine logic.

## Dimensions

1. **Same input → same output**: DeterminismEngine records runs and validates that all runs with the same input (by hash) produce equal output.
2. **Replay consistency**: ReplayRunner replays recorded inputs and DeterminismEngine validates that outputs match.
3. **Snapshot tests**: ConsistencyEngine validates pair equality; optional custom equality for numeric tolerance.
4. **Golden tests**: Compare actual output against known-good golden output for regression.

## Test Locations

- `determinism/replay-tests/replay.spec.ts` — DeterminismEngine, ReplayRunner
- `determinism/snapshot-tests/snapshot.spec.ts` — ConsistencyEngine, InvariantEngine for snapshot shape
- `determinism/golden-tests/golden.spec.ts` — Golden output comparison

## Contracts

- DeterminismEngine: record(traceId, input, output, timestamp); validateForInput(input); validateAll().
- ReplayRunner: addRecord/loadRecords; replayAll() returns ValidationResult from DeterminismEngine.
- No engine execute() logic is changed; validation observes and asserts only.
