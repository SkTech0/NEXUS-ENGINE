# Commercial License

## Purpose

Define the commercial license model for NEXUS-ENGINE: use under a paid commercial license for production and commercial deployment beyond OSS terms. Additive; no change to engine behavior or APIs.

## Principles

- **Paid use**: Customer pays for right to use engine in production/commercial context; license terms define scope, restrictions, and support.
- **Enforcement**: License validation at install, startup, or via entitlement (commercial/license-validation); enforcement at platform/gateway, not in engine request path.
- **No engine logic change**: Licensing is legal and commercial policy; engine code and API unchanged.

## License Characteristics

| Aspect | Commercial typical |
|--------|---------------------|
| **Use** | Production, commercial; scope per contract (dev/test, production, nodes, users) |
| **Modification** | Per contract; often limited to config and integration; no fork of core |
| **Distribution** | No redistribution of engine; customer deploys for own use |
| **Support** | Per tier (operations/support-tiers) |
| **Warranty** | Per contract; limited warranty typical |
| **Term** | Subscription (term) or perpetual with maintenance (org-specific) |

## Tier Alignment

- **Developer / professional**: Commercial license for dev/test or production (tiers/developer, professional).
- **Library / runtime / module**: Commercial license for embedding or self-hosted runtime (offerings/engine-as-a-library, engine-as-a-runtime, engine-as-a-module).
- **Enterprise**: Enterprise license may supersede standard commercial (licensing/enterprise).
- No engine logic or API changes; commercial license is legal and commercial only.

## Monetization Alignment

- Subscription or perpetual + maintenance (monetization/subscription); usage-based or capacity-based add-ons (monetization/usage-based, capacity-based).
- Billing, metering, entitlements (commercial/billing, metering, entitlements); contract enforcement (commercial/contract-enforcement).
- No engine regression.

## Certification Readiness

- Commercial license model documented; terms and enforcement are org-specific.
- No engine regression.
