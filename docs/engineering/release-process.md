# Release Process

## Versioning

- Use semantic versioning (e.g. `0.0.1`)
- Tag releases in git; CI/CD uses tags for Docker images

## Flow

1. **Develop** on `develop`; CI runs on push/PR.
2. **Merge** to `main`; CD builds images, runs security scans, deploys staging.
3. **Production** deploy after staging verification (approval gate).
4. **Tag** release: `git tag v0.0.1 && git push origin v0.0.1`.

## Quality Gates Before Release

- All CI jobs green
- Security scan clean (no critical/high)
- Engine flow pass
- Coverage meets thresholds

## Artifacts

- Docker images: `ghcr.io/<owner>/nexus-engine-api`, `nexus-product-ui`
- Test/coverage reports: CI artifacts, `reports/`
