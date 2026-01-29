# Cloud Marketplaces

## Purpose

Define cloud marketplace distribution for NEXUS-ENGINE: listing and delivery of the engine (or EaaS) on public cloud marketplaces (AWS Marketplace, Azure Marketplace, GCP Marketplace, etc.) for discoverability and integrated billing. Additive; no change to engine behavior or APIs.

## Principles

- **Marketplace listing**: Engine (container, AMI, ARM template, or SaaS listing) is published on one or more cloud marketplaces; customer subscribes via marketplace and may use integrated billing (pay via cloud bill).
- **Contract-preserving**: Engine API and behavior unchanged; marketplace adds discovery, entitlement, and billing integration.
- **Multi-cloud**: Listing may exist on multiple marketplaces; packaging and compliance per cloud (packaging/container-bundles, deployment-bundles).

## Marketplace Types

| Type | Description | Artifact |
|------|-------------|----------|
| **Container** | Kubernetes/container offering; customer deploys in their cluster | OCI image + Helm or equivalent |
| **AMI / VM** | VM image; customer runs in their VPC | AMI, VHD, or equivalent |
| **SaaS** | EaaS listing; customer subscribes and gets API endpoint | No artifact; API + entitlement |
| **Solution / template** | Cloud Formation, Terraform, ARM/Bicep template referencing image or SaaS | Template + docs |

## Listing and Entitlement

- **Listing**: Product name, description, pricing (BYOL, hourly, monthly, usage-based per marketplace); support and SLA per tier (operations/support-tiers, sla-tiers).
- **Entitlement**: Marketplace passes entitlement (subscription, plan) to provider; provider validates and applies quotas (commercial/entitlements; api-product/api-plans).
- **Billing**: Customer pays via cloud bill; provider receives payment per marketplace agreement; metering may be provider or marketplace (commercial/billing, metering).

## Tier and Offering Alignment

- **EaaS**: SaaS listing on marketplaces (offerings/engine-as-a-service).
- **Runtime**: Container or VM listing for self-hosted (offerings/engine-as-a-runtime; packaging/container-bundles).
- **Community / developer / professional / enterprise**: Different listings or plans per tier (tiers/).
- No engine logic or API changes; cloud marketplace is distribution and commercial only.

## Certification Readiness

- Cloud marketplace distribution documented; listing and billing integration are org and marketplace-specific.
- No engine regression.
