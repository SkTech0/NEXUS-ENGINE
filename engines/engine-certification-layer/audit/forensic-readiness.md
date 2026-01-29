# Forensic Readiness

## Purpose

Define forensic readiness for NEXUS-ENGINE: ability to support incident investigation and legal or regulatory proceedings. Additive; no change to engine behavior.

## Principles

- Evidence preservation: audit logs and lineage are retained and integrity-protected (see immutable-logs).
- Chain of custody: access to evidence is logged; evidence is reproducible where possible.
- No destruction of evidence: retention and disposal follow policy; legal hold supported.

## Evidence Types

| Type | Source | Use |
|------|--------|-----|
| Audit log | Audit sink | Who did what, when. |
| Decision lineage | Audit / lineage store | How decision was made, on what data and model. |
| State snapshots | Backup / snapshot | State at a point in time for replay. |
| Config history | Config store / audit | What configuration was in effect. |

## Engine Support

- Engine emits audit events and lineage; platform preserves and protects them.
- Replay and state restore support reproducible investigation (see engine-resilience-layer, engine-validation).
- No engine logic or API changes required; forensics is platform and process.

## Certification Readiness

- Forensic readiness documented; procedures are organization-specific.
- No engine logic or API changes required.
