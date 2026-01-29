# Quality Gates

## Rules (`quality/`)

- **coverage-rules.yml**: Line/branch/function thresholds, coverage > 80%
- **lint-rules.yml**: ESLint, Prettier, dotnet format, Ruff
- **security-rules.yml**: No critical/high vulns, SAST, secret scan
- **performance-rules.yml**: API p95, inference/optimization latency, build time
- **reliability-rules.yml**: Engine flow pass, health OK, chaos acceptable

## Gates

- Tests mandatory
- Build must pass
- Engine flow must pass
- No critical vulnerabilities

## Enforcement

- CI jobs fail if tests fail or build fails
- Security workflow reports vulns; gate on severity
