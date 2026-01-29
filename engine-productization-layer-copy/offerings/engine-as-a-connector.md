# Engine-as-a-Connector

## Purpose

Define the engine-as-a-connector offering: NEXUS-ENGINE packaged as a connector or adapter that integrates with external systems (ETL, BI, workflow engines, data platforms) so those systems can invoke engine capabilities (e.g., decisions, optimization, intelligence) without custom code. Additive; no change to engine behavior or APIs.

## Principles

- **Integration-first**: Connector implements the protocol or API expected by the host system; engine is the backend; connector is a thin adapter (ecosystem/connector-ecosystem).
- **Host-agnostic**: Connector can target multiple hosts (e.g., Kafka, Airflow, Databricks, Snowflake, Mule, etc.); each connector variant is a separate artifact or config.
- **Engine behind connector**: All semantics and behavior come from engine; connector does not implement business logic; no engine logic or API changes.

## Offering Characteristics

| Aspect | Description |
|--------|-------------|
| **Connector type** | Source/sink or transform adapter for host system |
| **Protocol** | Host-specific (e.g., JDBC, REST, Kafka Connect, custom) |
| **Engine invocation** | Connector calls engine API (contracts/); auth and endpoint configurable |
| **Delivery** | Package per host ecosystem (e.g., Kafka Connect plugin, npm package, Python package) |
| **License** | Per tier; often same as engine-as-a-library or runtime (licensing/) |

## Connector Ecosystem Alignment

- Connectors are part of ecosystem/connector-ecosystem; certification or compatibility program may apply (governance/compatibility-policy).
- Marketplace may list first-party and third-party connectors (ecosystem/marketplace-ecosystem).
- No engine logic or API changes; connector is an integration layer only.

## Tier Mapping

| Tier | Connector offering |
|------|---------------------|
| Community | Reference connectors; limited or OSS |
| Developer | Dev/test connectors; standard packaging |
| Professional / enterprise | Certified connectors; support; production use |
| Regulated / sovereign | Connectors with compliance and distribution constraints |

## Certification Readiness

- Engine-as-a-connector offering documented; connector implementation and certification are org-specific.
- No engine regression.
