# Compute-Based Pricing

## Purpose

Define compute-based monetization for NEXUS-ENGINE: pricing tied to compute consumption (CPU, memory, GPU, node-hours) when the engine runs as runtime or in EaaS. Additive; no change to engine behavior or APIs.

## Principles

- **Compute metering**: Usage is measured in compute units (vCPU-seconds, GB-hours, GPU-hours, or node-hours); billing per unit or tiered (commercial/metering, billing).
- **Runtime and EaaS**: Applies to engine-as-a-runtime (self-hosted metering) or EaaS (provider meters compute per tenant) (offerings/engine-as-a-runtime, engine-as-a-service).
- **No engine logic change**: Metering is platform/orchestration; engine code and API unchanged.

## Compute Dimensions

| Dimension | Description | Typical unit |
|-----------|-------------|--------------|
| **vCPU-seconds** | CPU time consumed by engine process | Per 1000 vCPU-seconds |
| **Memory-hours** | GB-hour of memory allocated | Per GB-hour |
| **GPU-hours** | GPU time (if engine uses GPU) | Per GPU-hour |
| **Node-hours** | Full node or instance hours (runtime) | Per node-hour |

## Pricing Structure

- **Per unit**: Price per vCPU-second, GB-hour, or node-hour.
- **Tiered**: Included compute in plan; overage billed.
- **Capacity-based**: Reserved capacity (monetization/capacity-based) may combine with compute metering.
- No engine logic or API changes; compute pricing is commercial only.

## Commercial Alignment

- Metering (commercial/metering); usage tracking (commercial/usage-tracking); billing (commercial/billing).
- Runtime license (licensing/runtime); capacity pricing (monetization/capacity-based).
- No engine regression.

## Certification Readiness

- Compute-based pricing documented; metering and billing are org-specific.
- No engine regression.
