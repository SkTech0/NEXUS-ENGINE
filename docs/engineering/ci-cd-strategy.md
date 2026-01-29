# CI/CD Strategy

## CI (`.github/workflows/ci.yml`)

- **Lint & build**: Node, nx lint + build
- **Unit tests (UI)**: Karma headless, coverage artifact
- **Unit & integration (API)**: dotnet test, Trx artifacts
- **Engine tests (Python)**: pytest per engine (matrix)
- **Engine flow**: Start API, run `test-engine-flow.sh`
- **Quality gate**: All required jobs must pass

## CD (`.github/workflows/cd.yml`)

- **Build**: Docker images for engine-api, product-ui
- **Scan**: Trivy image scan, SARIF upload
- **Push**: GHCR (`ghcr.io`)
- **Deploy**: Staging → Production (placeholder; add kubectl/helm)

## Security (`.github/workflows/security.yml`)

- Dependency review (PRs)
- npm / .NET / pip audit
- CodeQL SAST
- Secret scanning (Gitleaks)
- Trivy FS scan

## Triggers

- CI: push/PR to `main`, `develop`
- CD: push to `main`, workflow_dispatch
- Security: push/PR, weekly schedule
