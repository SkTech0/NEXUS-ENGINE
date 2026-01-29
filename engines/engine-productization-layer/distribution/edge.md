# Edge Distribution

## Purpose

Define edge distribution for NEXUS-ENGINE: delivery of the engine for deployment at the edge (low-latency, local compute, constrained or distributed nodes). Additive; no change to engine behavior or APIs.

## Principles

- **Edge-optimized**: Packaging may use smaller footprint (minimal container, lightweight runtime) for resource-constrained or edge nodes (packaging/container-bundles, runtime-bundles).
- **Local or distributed**: Engine runs at edge; may sync or federate with central; topology is deployment and config, not engine logic change.
- **Distribution channel**: Edge artifacts delivered via private registry, OTA, or air-gapped (distribution/on-prem, air-gapped) per customer.

## Edge Packaging

| Aspect | Description |
|--------|-------------|
| **Image** | Minimal or distroless variant; smaller size (packaging/container-bundles) |
| **Runtime** | Lightweight runtime bundle if not container (packaging/runtime-bundles) |
| **Config** | Edge-specific config (e.g., sync endpoint, offline mode); schema only |
| **Resource** | Lower default CPU/memory; suitable for edge nodes |

## Tier and Use Case Alignment

- **Professional / enterprise**: Edge for low-latency or offline-capable deployments (tiers/professional, enterprise).
- **Offering**: Engine-as-a-runtime (offerings/engine-as-a-runtime); deployment bundle for edge (packaging/deployment-bundles).
- **License**: Runtime license; validation at startup or heartbeat (commercial/license-validation); no engine logic or API changes; edge is packaging and distribution only.

## Certification Readiness

- Edge distribution documented; image and deployment are org-specific.
- No engine regression.
