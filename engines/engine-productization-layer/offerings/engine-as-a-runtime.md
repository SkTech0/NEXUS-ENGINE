# Engine-as-a-Runtime

## Purpose

Define the engine-as-a-runtime offering: NEXUS-ENGINE delivered as a runnable process or container that the customer deploys and operates in their own environment (on-prem, cloud, edge). Additive; no change to engine behavior or APIs.

## Principles

- **Customer-deployed**: Customer receives runtime bundle or container (packaging/runtime-bundles, container-bundles, deployment-bundles); they install, configure, and run it.
- **No hosting by provider**: Operations responsibility lies with customer; optional managed or hosted variants are separate (operations/managed-engine, hosted-engine).
- **License and tier**: Runtime use is governed by license (licensing/runtime, commercial, enterprise) and tier (tiers/); license validation at startup or via entitlement (commercial/license-validation).

## Offering Characteristics

| Aspect | Description |
|--------|-------------|
| **Delivery** | Runtime bundle (tarball, package manager) or container image (packaging/) |
| **Deployment** | On-prem, cloud VPC, Kubernetes, edge (distribution/on-prem, edge, air-gapped) |
| **License** | Runtime license or subscription; validation at start or heartbeat (commercial/license-validation) |
| **Support** | Per tier (operations/support-tiers); upgrades and patches documented (governance/lifecycle-management) |
| **Config** | Schema and defaults; secrets externalized; no engine logic change |

## Tier and Distribution Mapping

| Tier | Runtime offering |
|------|-------------------|
| Developer | Single-node or limited-node runtime; dev/test |
| Professional | Production runtime; on-prem or cloud; standard support |
| Enterprise | Production; HA/DR options; enterprise support; data residency |
| Regulated | Signed bundles; air-gapped option; audit and compliance |
| Sovereign | Sovereign cloud or on-prem; data sovereignty; sovereign edition (tiers/sovereign) |

## Monetization Alignment

- Subscription or capacity-based pricing for runtime (monetization/subscription, capacity-based); optional compute-based (monetization/compute-based).
- Metering may be node-based, instance-based, or usage-based (commercial/metering); enforcement at platform or license layer, not in engine request path.
- No engine logic or API changes; runtime offering is packaging and commercial model only.

## Certification Readiness

- Engine-as-a-runtime offering documented; build, delivery, and license enforcement are org-specific.
- No engine regression.
