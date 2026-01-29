# Connector Ecosystem

## Purpose

Define the connector ecosystem for NEXUS-ENGINE: first-party and optional third-party connectors that integrate the engine with external systems (ETL, BI, workflow, data platforms). Additive; no change to engine behavior or API contracts.

## Principles

- **Integration-first**: Connectors implement host system protocol or API; engine is backend; connector is thin adapter (offerings/engine-as-a-connector; packaging/).
- **Engine behind connector**: All semantics from engine; connector does not implement business logic; no engine logic or API changes.
- **Certification**: First-party connectors are supported; third-party connectors may be certified or community (governance/compatibility-policy; ecosystem/marketplace-ecosystem).

## Connector Types

| Type | Description | Example hosts |
|------|-------------|---------------|
| **Data / ETL** | Ingest or emit data; call engine for decisions/optimization | Kafka, Airflow, Databricks, Snowflake |
| **Workflow** | Invoke engine from workflow steps | Mule, n8n, Temporal |
| **BI / analytics** | Expose engine results to BI tools | Tableau, Power BI (via API or connector) |
| **Custom** | Org-specific protocol or system | Internal platforms |

## Ecosystem Scope

| Aspect | Description |
|--------|-------------|
| **First-party** | Connectors built and maintained by provider (offerings/engine-as-a-connector) |
| **Third-party** | Partner or community connectors; certification optional (ecosystem/marketplace-ecosystem) |
| **Delivery** | Package per host (Kafka Connect plugin, npm, PyPI) (packaging/) |
| **License** | Per tier; same as engine-as-a-connector (licensing/) |

## Platform Alignment

- Connector ecosystem is part of engine-as-a-platform (offerings/engine-as-a-platform); marketplace may list connectors (ecosystem/marketplace-ecosystem).
- No engine logic or API changes; connector ecosystem is product and packaging only.

## Certification Readiness

- Connector ecosystem documented; certification and distribution are org-specific.
- No engine regression.
