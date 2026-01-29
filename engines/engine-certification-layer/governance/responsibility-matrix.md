# Responsibility Matrix

## Purpose

Define responsibility mapping for NEXUS-ENGINE: who is accountable for engine operations, data, risk, and compliance. Additive; no change to engine behavior.

## Roles (Example)

| Role | Responsibility | Engine Relevance |
|------|----------------|------------------|
| Engine operator | Run, configure, monitor engine | Operations, logging, access |
| Data owner | Data classification, retention, consent | Data governance, compliance |
| Model owner | Model approval, versioning, monitoring | Model governance |
| Security | Access, encryption, incident response | Enterprise IAM, audit |
| Compliance | Policies, audits, certifications | Compliance, legal |
| Product / platform | Integration, SLA, contracts | Legal, enterprise |

## Engine-Specific Responsibilities

| Area | Owner | Evidence |
|------|--------|----------|
| Engine availability | Operator / platform | Resilience, DR, monitoring |
| Decision traceability | Operator / platform | Audit, lineage |
| Data in engine | Data owner | Data governance, retention |
| Model in use | Model owner | Model governance, versioning |
| Access to engine | Security / IAM | Access governance, RBAC |
| Compliance posture | Compliance | Compliance docs, audit |

## Accountability Design

- Every significant decision is logged with actor and context (see audit).
- Responsibility matrix is maintained at organization level; engine design supports attribution.
- Legal accountability and liability boundaries documented in legal/accountability and liability-boundaries.

## Certification Readiness

- Responsibility matrix documented; assignment is organization-specific.
- No engine logic or API changes required.
