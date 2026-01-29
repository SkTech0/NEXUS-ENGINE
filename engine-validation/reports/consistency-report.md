# Consistency Report

## Purpose

Summarizes consistency validation: cross-run consistency, pair equality, contribution normalization. No engine logic modification.

## Components

- **ConsistencyEngine**: setEquality; validatePair; validatePairs; validateReplayOutputs.
- **InvariantEngine**: Invariants on state (outcome in set, confidence in [0,1], etc.).
- **Logic tests**: decision, optimization, trust consistency (logic/decision-tests, optimization-tests, trust-tests).

## Test Locations

- logic/invariants/invariants.spec.ts
- logic/decision-tests/decision.spec.ts
- determinism/snapshot-tests/snapshot.spec.ts

## Spec

- logic/logic.spec.md

## Contract

- All tests use validators only; no engine logic is modified.
