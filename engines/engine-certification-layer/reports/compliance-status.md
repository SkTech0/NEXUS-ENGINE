# Compliance Status Report

## Purpose

Report on NEXUS-ENGINE compliance status against regulations and standards. Additive; no change to engine behavior. Report is a template; content is organization and deployment specific.

## Compliance Areas

| Area | Documentation | Status |
|------|---------------|--------|
| ISO 27001 | compliance/iso27001 | Alignment documented; control implementation org-specific |
| SOC 2 | compliance/soc2 | Alignment documented; control operation org-specific |
| GDPR | compliance/gdpr | Alignment documented; compliance deployment-specific |
| HIPAA | compliance/hipaa | Alignment documented; BAA and policies org-specific |
| PCI-DSS | compliance/pci-dss | Alignment documented; scope environment-specific |
| AI governance | compliance/ai-governance | Alignment documented; cert use-case specific |
| Data protection | compliance/data-protection | Posture documented; implementation deployment-specific |
| Cross-border | compliance/cross-border | Posture documented; transfer mechanisms contract-specific |

## Evidence

- Compliance documentation defines alignment; evidence (audit, config, policies) is collected per certification/evidence-pipeline.
- Status is updated as controls are implemented and evidenced; no engine logic or API changes required.

## Status

- Compliance status is organization and deployment-specific.
- Engine design supports compliance objectives; report template is in engine-certification-layer.
- No engine regression.
