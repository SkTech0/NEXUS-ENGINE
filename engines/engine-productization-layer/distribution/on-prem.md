# On-Premises Distribution

## Purpose

Define on-premises distribution for NEXUS-ENGINE: delivery of the engine for deployment in the customer’s data center or private cloud (no provider hosting). Additive; no change to engine behavior or APIs.

## Principles

- **Customer-owned infrastructure**: Engine runs on customer hardware or private cloud; provider does not operate the runtime (operations/managed-engine, hosted-engine are separate).
- **Controlled delivery**: Artifacts (runtime bundle, container, deployment bundle) delivered via private registry, download, or air-gapped package (distribution/air-gapped); signed and versioned (packaging/).
- **License and support**: Runtime or enterprise license (licensing/runtime, enterprise); support per tier (operations/support-tiers).

## Delivery Mechanisms

| Mechanism | Description | Use case |
|-----------|-------------|----------|
| **Private registry** | Container image in customer or provider private registry | Kubernetes, cloud-in-datacenter |
| **Runtime bundle** | Tarball or package manager; customer installs on VM/bare metal | VM, bare metal (packaging/runtime-bundles) |
| **Deployment bundle** | Helm/Kustomize/Terraform for customer cluster | Kubernetes on-prem (packaging/deployment-bundles) |
| **Air-gapped** | Offline package (tarball of image + manifests); no outbound pull | Regulated, sovereign (distribution/air-gapped) |

## Tier and License Alignment

- **Professional / enterprise**: On-prem common (tiers/professional, enterprise); runtime or enterprise license (licensing/runtime, enterprise).
- **Regulated / sovereign**: On-prem preferred for regulated data; air-gapped option (tiers/regulated, sovereign; distribution/air-gapped).
- **Support**: On-prem support and upgrade process documented (operations/support-tiers); lifecycle (governance/lifecycle-management).
- No engine logic or API changes; on-prem is distribution and packaging only.

## Certification Readiness

- On-prem distribution documented; delivery and support are org-specific.
- No engine regression.
