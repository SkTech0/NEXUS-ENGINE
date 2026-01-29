# Runtime License

## Purpose

Define the runtime license model for NEXUS-ENGINE: use when the engine is deployed as a runnable process or container that the customer operates (self-hosted, on-prem, edge). Additive; no change to engine behavior or APIs.

## Principles

- **Runtime use**: License grants right to run the engine (binary or container); no embedding in third-party product; customer is operator and end-consumer.
- **Validation**: License validated at startup or via heartbeat (commercial/license-validation); enforcement at platform or launcher, not in engine request path.
- **No engine logic change**: Licensing is legal and commercial policy; engine code and API unchanged.

## License Characteristics

| Aspect | Runtime typical |
|--------|------------------|
| **Use** | Running engine as service; self-hosted, on-prem, edge (offerings/engine-as-a-runtime) |
| **Scope** | Per instance, per node, per core, or unlimited per contract (org-specific) |
| **Redistribution** | No; customer does not redistribute engine |
| **Support** | Per tier (operations/support-tiers) |
| **Term** | Subscription (annual/monthly) or perpetual with maintenance |

## Tier and Offering Alignment

- **Developer / professional / enterprise**: Runtime license for self-hosted (tiers/; offerings/engine-as-a-runtime).
- **Regulated / sovereign**: Runtime license with air-gapped and signed distribution (tiers/regulated, sovereign; distribution/air-gapped).
- **Packaging**: Runtime and container bundles (packaging/runtime-bundles, container-bundles) delivered under runtime license.
- No engine logic or API changes; runtime license is legal and commercial only.

## Commercial Alignment

- License validation at startup or periodic (commercial/license-validation); entitlements (commercial/entitlements).
- Subscription or capacity-based pricing (monetization/subscription, capacity-based); metering optional (commercial/metering).
- No engine regression.

## Certification Readiness

- Runtime license model documented; validation and scope are org-specific.
- No engine regression.
