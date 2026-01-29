# Engine-as-a-Platform

## Purpose

Define the engine-as-a-platform offering: NEXUS-ENGINE as a programmable platform that exposes APIs, SDKs, extensions, and ecosystem (plugins, connectors, marketplace) for building applications and solutions on top of the engine. Additive; no change to engine behavior or API contracts.

## Principles

- **Platform surface**: API (packaging/api-bundles), SDK (packaging/sdk-bundles), extension points (ecosystem/extension-ecosystem), and optional marketplace (ecosystem/marketplace-ecosystem) form the platform.
- **Ecosystem-first**: Third-party plugins, connectors, and integrations are first-class; governance and compatibility apply (governance/compatibility-policy, ecosystem/).
- **Multi-consumption**: Platform can be consumed as EaaS (offerings/engine-as-a-service) or as runtime/library (engine-as-a-runtime, engine-as-a-library) with platform capabilities (extensions, marketplace) enabled per tier.

## Offering Characteristics

| Aspect | Description |
|--------|-------------|
| **API** | Full engine API + productized plans and quotas (api-product/) |
| **SDK** | Multi-language clients (packaging/sdk-bundles, ecosystem/sdk-ecosystem) |
| **Extensions** | Plugin and extension model (ecosystem/plugin-ecosystem, extension-ecosystem) |
| **Connectors** | Connector ecosystem for data/systems (ecosystem/connector-ecosystem) |
| **Marketplace** | Optional catalog of plugins, connectors, solutions (ecosystem/marketplace-ecosystem) |
| **Documentation** | API reference, guides, lifecycle (governance/lifecycle-management) |

## Tier Mapping

| Tier | Platform capabilities |
|------|------------------------|
| Community | API + SDK; limited extensions or public plugins only |
| Developer | API + SDK + extension development; sandbox |
| Professional | Full API/SDK; certified plugins/connectors; production use |
| Enterprise | Full platform; private marketplace; SLA; data residency |
| Regulated / sovereign | Platform with compliance and sovereignty constraints |

## Monetization Alignment

- Platform pricing can combine subscription, usage-based, and marketplace revenue share (monetization/); API quotas and rate models apply (api-product/).
- No engine logic or API changes; platform offering is productization and ecosystem definition only.

## Certification Readiness

- Engine-as-a-platform offering documented; ecosystem and marketplace implementation are org-specific.
- No engine regression.
