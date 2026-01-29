# State Correctness Spec

## Objective

Validate state transitions, lifecycle correctness, recovery transitions, rollback correctness, and compensation flows. No modification of engine logic.

## Dimensions

1. **Lifecycle**: StateValidator setInitialState, allow, validateTransition, validatePath.
2. **Transition**: Rules with event; multiple allowed targets.
3. **Recovery**: failed → recovering → recovered/degraded.
4. **Rollback**: completed → rolling_back → rolled_back.

## Test Locations

- `state/lifecycle-tests/lifecycle.spec.ts`
- `state/transition-tests/transition.spec.ts`
- `state/recovery-tests/recovery.spec.ts`
- `state/rollback-tests/rollback.spec.ts`

## Contracts

- StateValidator: setInitialState, allow, addRule, validateTransition, validatePath. No engine state machine is modified.
