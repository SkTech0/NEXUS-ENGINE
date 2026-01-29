# Cross-Border Data Compliance

## Purpose

Document cross-border data transfer and localization considerations for NEXUS-ENGINE deployments. Additive; no change to engine behavior.

## Scope

- Transfer of personal data from EEA (GDPR), UK (UK GDPR), and other jurisdictions with transfer restrictions.
- Localization requirements (e.g., data residency) where applicable.
- Engine as processing component; data flows and transfer mechanisms defined at platform and contract level.

## Transfer Mechanisms

| Mechanism | Use | Engine Relevance |
|-----------|-----|------------------|
| Adequacy | EU Commission / UK adequacy decision | Deployment in adequate country |
| SCCs | Standard contractual clauses | Contractual; engine supports secure processing |
| BCRs | Binding corporate rules | Organization-level |
| Derogations | Art. 49 GDPR (limited) | Exceptional; documented |

Engine does not perform transfers; integration and platform define where data is sent and which mechanism applies.

## Data Residency and Localization

- Engine can be deployed in specified regions; data residency satisfied by deployment and storage configuration.
- No design requirement for data to leave a chosen jurisdiction for core engine operation; cross-region replication and DR documented (see dr).

## Documentation and Contracts

- Data processing agreements and transfer clauses (see legal/compliance-contracts).
- Records of processing and transfer impact assessments: engine role and data flows documented; no engine logic change.

## Certification Readiness

- Cross-border and localization posture documented; implementation is deployment and contract-specific.
- No engine logic or API changes required.
