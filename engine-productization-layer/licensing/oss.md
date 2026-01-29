# OSS License Model

## Purpose

Define the open-source license model for NEXUS-ENGINE: use under an OSS license (e.g., Apache 2.0, MIT, or dual-license) for community and certain commercial use. Additive; no change to engine behavior or APIs.

## Principles

- **Open source**: Engine (or a subset) is available under an OSS license; source and binary distribution permitted per license terms.
- **Commercial use**: OSS license may allow commercial use with attribution and/or copyleft conditions; dual-license (OSS + commercial) is org-specific.
- **No engine logic change**: Licensing is legal and distribution policy; engine code and API unchanged.

## License Characteristics

| Aspect | OSS typical |
|--------|-------------|
| **Use** | Personal, evaluation, commercial (per license) |
| **Modification** | Allowed per license; contribution policy org-specific |
| **Distribution** | Allowed; source and/or binary per license |
| **Attribution** | Required per license |
| **Patent** | License-dependent (e.g., Apache 2.0 patent grant) |
| **Warranty** | As-is; no warranty (standard OSS) |

## Tier and Offering Alignment

- **Community tier**: OSS or OSS-based freemium (tiers/community).
- **Developer / professional**: May use OSS with optional commercial upgrade for support, SLA, or additional rights (licensing/commercial).
- **Library / runtime**: OSS distribution via package managers (packaging/, offerings/engine-as-a-library, engine-as-a-runtime).
- No engine logic or API changes; OSS model is legal and distribution only.

## Dual-License and Commercial Upgrade

- If dual-license: commercial use without OSS obligations (e.g., proprietary derivative, no source disclosure) under commercial license (licensing/commercial).
- Upgrade path from OSS to commercial/enterprise documented; no engine regression.

## Certification Readiness

- OSS license model documented; exact license and dual-license terms are org-specific.
- No engine regression.
