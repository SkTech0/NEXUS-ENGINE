# Logical Correctness Spec

## Objective

Validate decision rules, optimization rules, fallback logic, recovery logic, trust logic, confidence logic, and propagation logic. No modification of engine logic.

## Dimensions

1. **Invariants**: InvariantEngine asserts that state and outputs satisfy declared invariants (outcome in allowed set, confidence in [0,1], etc.).
2. **Rule validation**: Decision outcome, confidence range, required fields via DataValidator contracts.
3. **Decision tests**: Decision result has outcome and confidence; consistency of repeated decisions.
4. **Optimization tests**: Objective value, feasible flag, constraint slack non-negative when satisfied.
5. **Trust tests**: Trust score in [0,1], trust gate result (allowed boolean), payload contract.

## Test Locations

- `logic/invariants/invariants.spec.ts`
- `logic/rule-tests/rule.spec.ts`
- `logic/decision-tests/decision.spec.ts`
- `logic/optimization-tests/optimization.spec.ts`
- `logic/trust-tests/trust.spec.ts`

## Contracts

- All tests use InvariantEngine, ConsistencyEngine, or DataValidator only.
- No engine execute() or business logic is modified; validation observes outputs only.
