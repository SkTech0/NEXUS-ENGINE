# Test Report

*Auto-generated placeholder. CI produces JUnit/Trx artifacts; aggregate here.*

## Summary

| Layer        | Framework   | Location                    |
|-------------|-------------|-----------------------------|
| product-ui  | Karma/Jasmine | product-ui, nx test       |
| engine-api  | xUnit       | engine-api/tests           |
| engines     | pytest      | engine-*/tests             |
| engine flow | scripts     | scripts/test-engine-flow.sh |

## Quality Gates

- Coverage: see `coverage-rules.yml`
- Tests mandatory: all must pass
- Engine flow must pass

## Artifacts

- `**/*.trx` — .NET test results
- `**/junit-*.xml` — pytest results
- `coverage/product-ui` — UI coverage
