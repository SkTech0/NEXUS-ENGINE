# Container Bundles

## Purpose

Define container bundles for NEXUS-ENGINE: engine packaged as OCI-compliant container images for deployment in Kubernetes, cloud runtimes, or air-gapped registries. Additive; no change to engine behavior or APIs.

## Principles

- **OCI-compliant**: Images follow OCI image spec; build from Dockerfile or equivalent; multi-stage where applicable to minimize image size.
- **Single process focus**: Primary image runs engine API/runtime; sidecars (e.g., observability) are separate images or optional.
- **Reproducible**: Image build is deterministic where feasible; tag strategy (semver, digest) documented.

## Image Variants

| Variant | Base | Use case |
|---------|------|----------|
| **Standard** | Minimal OS + runtime (Node/.NET/Python) | Cloud, Kubernetes, default |
| **Distroless / minimal** | Distroless or Alpine-style base | Security-sensitive, regulated |
| **Edge** | Smaller footprint, optional edge config | Edge (distribution/edge) |

## Tagging and Versioning

- **Tags**: Semantic version (e.g., `2.1.0`), major-minor (e.g., `2.1`), latest (policy-defined); optional digest-based tags.
- **Compatibility**: Image version aligns with engine version; compatibility policy applies (governance/compatibility-policy).
- No engine logic or API changes; container bundle is packaging only.

## Registry and Distribution

- **Public registry**: For community/developer tier; org-specific registry name.
- **Private registry**: For professional, enterprise, regulated, sovereign; access control and scanning (org-specific).
- **Air-gapped**: Offline bundle (tarball of image or chart) for air-gapped installs (distribution/air-gapped).

## Tier and License Alignment

- **Community / developer**: Public or rate-limited pull; no license check in image.
- **Professional / enterprise**: Private registry; optional license or entitlement check at startup (commercial/license-validation).
- **Regulated / sovereign**: Signed images, private registry, audit trail; air-gapped delivery option.

## Certification Readiness

- Container bundle spec documented; build, sign, and push are org-specific.
- No engine regression.
