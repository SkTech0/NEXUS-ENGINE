# Distributed Correctness Report

## Purpose

Summarizes distributed correctness validation: concurrency, chaos, fault injection, retry idempotency. No engine logic modification.

## Components

- **ChaosRunner**: applyBeforeExecute (delay, fail, drop); shouldDrop; shouldFail; deterministic when seed set.
- **DeterminismEngine**: Same input → same output (retry idempotency).
- **ConsistencyEngine**: Concurrent output equality.

## Test Locations

- distributed/concurrency-tests/concurrency.spec.ts
- distributed/chaos-tests/chaos.spec.ts
- distributed/fault-injection/fault-injection.spec.ts
- distributed/retry-tests/retry.spec.ts

## Spec

- distributed/distributed.spec.md

## Contract

- ChaosRunner wraps execution; engine execute() is not modified. Retry tests assert idempotency via DeterminismEngine.
