# Warranty Model

## Purpose

Define the warranty model for NEXUS-ENGINE: what is warranted and what is disclaimed. Additive; no change to engine behavior.

## Principles

- Warranties are defined at organization and contract level; engine is a component.
- Typical: warranty of conformance to documentation and SLA; disclaimer of fitness for particular purpose unless agreed.
- Engine design supports verification (e.g., validation, determinism) for warranty assertions.

## Warranty Dimensions (Example)

| Dimension | Description |
|-----------|-------------|
| Conformance | Engine behaves as documented; validation and tests support this. |
| Availability / SLA | As per SLA model; resilience and monitoring support. |
| No malware | Supply chain and build process; not engine logic. |
| Disclaimers | No warranty for particular use, no liability for indirect damages, etc., as per contract. |

## Engine Support

- Engine validation and test suites support conformance evidence (see engine-validation).
- No engine logic or API changes required; warranty is contractual.

## Certification Readiness

- Warranty model documented; terms are contract-specific.
- No engine logic or API changes required.
