# Deployment Bundles

## Purpose

Define deployment bundles for NEXUS-ENGINE: packaged artifacts that include everything required to deploy the engine into a target environment (cloud, Kubernetes, on-prem, edge). Additive; no change to engine behavior or APIs.

## Principles

- **Deployable unit**: Bundle contains or references runtime, config templates, orchestration descriptors, and optional infra-as-code; one unit = one deployable instance or cluster.
- **Environment-specific**: Variants for Kubernetes, VM, serverless (if applicable), edge; same engine core, different deployment topology.
- **Repeatable**: Deployment is idempotent and versioned; rollback and upgrade paths defined.

## Bundle Types

| Type | Contents | Target |
|------|----------|--------|
| **Kubernetes bundle** | Manifests (Deployment, Service, ConfigMap, optional Ingress, HPA), Helm chart or Kustomize overlay | Kubernetes, managed K8s, on-prem K8s |
| **VM / bare-metal bundle** | Runtime bundle + systemd/init units, config templates, optional Ansible/Terraform | On-prem, edge |
| **Cloud formation bundle** | Terraform, CloudFormation, or ARM/Bicep templates referencing container or VM image | AWS, Azure, GCP |
| **Edge bundle** | Lightweight runtime + edge-specific config; minimal footprint | Edge (distribution/edge) |

## Contents Checklist

- Engine runtime or container image reference (packaging/runtime-bundles, packaging/container-bundles).
- Configuration schema and defaults; secrets externalized (env, vault, provider secrets).
- Health and readiness probes; resource requests/limits where applicable.
- Optional: observability (metrics, logs, traces) sidecar or config.
- Optional: license or entitlement check at deploy/startup (commercial/license-validation).

## Versioning and Lifecycle

- Deployment bundle version tied to engine version; compatibility and deprecation governed (governance/lifecycle-management, compatibility-policy).
- No engine logic or API changes; deployment bundle is packaging and orchestration only.

## Tier and Distribution Alignment

- **Developer / professional**: Standard K8s and cloud bundles; public or private registry.
- **Enterprise / regulated**: Private registry, air-gapped bundle variant (distribution/air-gapped), optional signed manifests.
- **Sovereign**: Sovereign cloud and data-residency compliant bundles (distribution/sovereign-cloud, tiers/sovereign).

## Certification Readiness

- Deployment bundle spec documented; CI/CD and release are org-specific.
- No engine regression.
