# Security Report

*Populated by Security workflow (npm audit, pip-audit, CodeQL, Trivy, Gitleaks).*

## Scans

- Dependency review (PRs)
- npm / .NET / pip audit
- CodeQL SAST
- Secret scanning (Gitleaks)
- Trivy FS & image

## Gates

- No critical vulns
- No high vulns (or exception)
- SAST pass, no secrets (see `quality/security-rules.yml`)
