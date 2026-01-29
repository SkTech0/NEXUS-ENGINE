# Accountability

## Purpose

Define accountability for NEXUS-ENGINE: who is accountable for engine operations, decisions, and compliance. Additive; no change to engine behavior.

## Principles

- Accountability by trace: every decision and significant action is attributable (see audit, governance).
- Responsibility matrix defines roles and ownership (see governance/responsibility-matrix).
- Legal accountability (e.g., controller, processor, data owner) is documented and assigned.

## Accountability Dimensions

| Dimension | Description |
|-----------|-------------|
| Operational | Who operates, configures, and maintains the engine (operator, platform). |
| Data | Who owns and is responsible for data (data owner; see data governance). |
| Model | Who approves and is responsible for models (model owner; see model governance). |
| Compliance | Who ensures compliance (compliance, legal). |
| Legal | Controller, processor, joint controller as per GDPR and contract (see compliance). |

## Engine Support

- Engine emits audit events with actor and context; platform assigns and stores accountability.
- Responsibility matrix and legal roles are organization-level; engine design supports traceability.
- No engine logic or API changes required.

## Certification Readiness

- Accountability model documented; assignment is organization-specific.
- No engine logic or API changes required.
