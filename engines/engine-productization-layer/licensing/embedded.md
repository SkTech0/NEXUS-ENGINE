# Embedded License

## Purpose

Define the embedded license model for NEXUS-ENGINE: use when the engine is embedded inside a customer’s or partner’s product (ISV, OEM, embedded system). Additive; no change to engine behavior or APIs.

## Principles

- **Embedded use**: Engine runs inside another product; end-user may not be aware of NEXUS-ENGINE; licensee (ISV/OEM) is responsible for compliance and support.
- **Redistribution**: License may allow redistribution as part of licensee’s product; terms define attribution, branding, and support (org-specific).
- **No engine logic change**: Licensing is legal and commercial policy; engine code and API unchanged.

## License Characteristics

| Aspect | Embedded typical |
|--------|-------------------|
| **Use** | Embedding in licensee’s product; OEM/ISV |
| **Redistribution** | Allowed as part of licensee product; no standalone redistribution of engine |
| **Attribution** | Per contract; may require “Powered by” or minimal attribution |
| **Support** | Licensee supports end-user; optional backline support from provider (operations/support-tiers) |
| **Modification** | Per contract; often config and integration only |
| **Term** | Per contract; royalty or flat fee (monetization/) |

## Tier and Offering Alignment

- **Engine-as-a-library, engine-as-a-module**: Primary delivery for embedded (offerings/engine-as-a-library, engine-as-a-module).
- **Developer / professional / enterprise**: Embedded license may apply to any tier depending on use case (tiers/).
- **Connector / platform**: Partners may embed engine as connector or platform component (offerings/engine-as-a-connector, engine-as-a-platform).
- No engine logic or API changes; embedded license is legal and commercial only.

## Monetization Alignment

- Royalty per unit, flat fee, or subscription (monetization/transaction-based, subscription); metering optional (commercial/metering).
- License validation at build or runtime (commercial/license-validation); no engine logic change.
- No engine regression.

## Certification Readiness

- Embedded license model documented; terms and redistribution are org-specific.
- No engine regression.
