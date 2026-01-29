# Distributed Correctness Spec

## Objective

Validate race conditions, concurrency safety, ordering consistency, partial failure handling, retry correctness, and isolation. No modification of engine logic.

## Dimensions

1. **Concurrency**: ChaosRunner delay/fail; ConsistencyEngine for concurrent output equality.
2. **Chaos**: ChaosRunner drop/fail with probability; deterministic seed for reproducibility.
3. **Fault injection**: ChaosRunner with target filter; probability 0 never triggers.
4. **Retry**: DeterminismEngine validates same input → same output (idempotency).

## Test Locations

- `distributed/concurrency-tests/concurrency.spec.ts`
- `distributed/chaos-tests/chaos.spec.ts`
- `distributed/fault-injection/fault-injection.spec.ts`
- `distributed/retry-tests/retry.spec.ts`

## Contracts

- ChaosRunner: applyBeforeExecute(target, input); shouldDrop(target); shouldFail(target). Deterministic when seed set.
- No engine execute() logic is changed; chaos wraps execution only.
