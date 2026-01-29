# Data Correctness Spec

## Objective

Validate schema correctness, transformation correctness, propagation correctness, lineage correctness, losslessness, and consistency across engines. No modification of engine logic.

## Dimensions

1. **Schema**: DataValidator.setSchemaCheck; valid/invalid shape.
2. **Contract**: DataValidator.addContract; validatePipeline for input and output.
3. **Pipeline**: DataValidator and InvariantEngine for output required fields.
4. **Lineage**: InvariantEngine for traceId/ref presence.

## Test Locations

- `data/schema-tests/schema.spec.ts`
- `data/contract-tests/contract.spec.ts`
- `data/pipeline-tests/pipeline.spec.ts`
- `data/lineage-tests/lineage.spec.ts`

## Contracts

- All tests use DataValidator or InvariantEngine only; no pipeline logic is modified.
