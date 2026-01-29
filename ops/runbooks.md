# Runbooks Standards

**Status:** Standard  
**Owner:** Platform Operations  
**Classification:** Ops — Runbooks  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS runbooks are structured, maintained, and used. Runbooks enable consistent and fast response to incidents and operational tasks; they are required for on-call and DR.

---

## 2. Runbook Types

### 2.1 Incident Runbooks

- **Purpose:** Mitigate or resolve a specific failure mode or alert.
- **Triggers:** Alert name, symptom, or incident type.
- **Contents:** Prerequisites (access, tools), steps in order, verification, escalation path, and owner/update date.
- **Example:** “Engine X unhealthy” → check health endpoint, check dependencies, restart if needed, escalate if not resolved.

### 2.2 DR Runbooks

- **Purpose:** Recover from disaster (AZ/region failure, data loss); see dr.md.
- **Contents:** RTO/RPO, pre-requisites, failover steps, verification, rollback (if applicable), and communication.
- **Example:** “Failover to region B” → declare DR, shift traffic, verify data and health, communicate status.

### 2.3 Operational Runbooks

- **Purpose:** Routine or periodic tasks (e.g., scaling, certificate rotation, backup verification).
- **Contents:** Schedule, prerequisites, steps, verification, and rollback if applicable.
- **Example:** “Certificate renewal” → request cert, deploy to gateway, verify TLS, restart if needed.

---

## 3. Structure (Template)

Every runbook MUST include:

- **Title and ID:** Unique identifier and short title.
- **Trigger:** When to use this runbook (alert, symptom, or request).
- **Owner:** Team or role responsible for keeping it current.
- **Last updated:** Date of last review.
- **Prerequisites:** Access (e.g., VPN, role), tools (e.g., CLI, dashboard), and permissions.
- **Steps:** Numbered steps; each step has action and expected outcome.
- **Verification:** How to confirm success (e.g., health check, SLO).
- **Escalation:** When and to whom to escalate.
- **References:** Links to related runbooks, docs, or playbooks.

---

## 4. Maintenance

- **Review:** Runbooks MUST be reviewed periodically (e.g., quarterly) and after every incident that used them; gaps and updates MUST be applied.
- **Testing:** Runbook steps SHOULD be tested (e.g., in DR drill or staging); changes to platform MUST trigger review of affected runbooks.
- **Ownership:** Every runbook MUST have an owner; ownership MUST be visible (e.g., in runbook store or wiki).

---

## 5. Accessibility

- Runbooks MUST be accessible to on-call and responders (e.g., wiki, runbook tool, or docs site); MUST be linked from alerts where possible.
- Runbook execution SHOULD be logged (who, when, which runbook) for audit and improvement.

---

## 6. References

- [incident-response.md](./incident-response.md)
- [dr.md](./dr.md)
- [chaos.md](./chaos.md)
- [engine-core/specs/engine-failure-model.md](../engine-core/specs/engine-failure-model.md)
- [engine-core/specs/engine-recovery-model.md](../engine-core/specs/engine-recovery-model.md)
