# Incident Response

**Status:** Standard  
**Owner:** Platform Operations  
**Classification:** Ops — Incident Response  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS classifies, responds to, and resolves incidents. Consistent incident response is required for SLO protection, customer communication, and continuous improvement.

---

## 2. Incident Classification

### 2.1 Severity

| Severity | Description | Response Target |
|----------|-------------|-----------------|
| **SEV-1** | Critical: broad outage, data loss risk, or security breach | Immediate; 24/7 response |
| **SEV-2** | Major: significant degradation or partial outage | Within 1 hour (business hours) or per escalation |
| **SEV-3** | Minor: limited impact, workaround available | Within 4 hours or next business day |
| **SEV-4** | Low: cosmetic or minimal impact | Treated as backlog |

### 2.2 Classification Criteria

- **Scope:** Number of users/tenants affected, percentage of traffic.
- **Impact:** Availability, latency, data integrity, security.
- **SLO impact:** Whether the incident consumes error budget and by how much.
- **Blast radius:** Single engine vs platform-wide.

Classification MUST be assigned at detection and updated as impact is understood; escalation MAY change severity.

---

## 3. Response Flow

### 3.1 Detection

- Alerts from SLI/SLO, health checks, and anomaly detection; may also be reported by users or support.
- On detection, incident is created and severity is assigned; on-call or incident commander is notified per escalation policy.

### 3.2 Triage and Escalation

- **Triage:** Confirm impact, scope, and severity; assign incident commander and responders.
- **Escalation:** SEV-1 and SEV-2 escalate per escalation policy (see escalation policies); leadership and customer success MAY be notified for SEV-1/2.

### 3.3 Mitigation

- **Immediate:** Restore service (e.g., rollback, failover, disable feature) or reduce impact (e.g., shed load, circuit open).
- **Communication:** Status page and/or customer communication per policy; internal updates to stakeholders.
- **Documentation:** Timeline, actions taken, and decisions recorded in incident record.

### 3.4 Resolution

- **Resolution:** Root cause addressed or workaround in place; SLO and health checks restored.
- **Incident closed:** When impact is resolved and no recurrence expected without follow-up; follow-up actions MAY be tracked as post-incident items.

### 3.5 Post-Incident

- **Post-incident review (PIR):** For SEV-1 and SEV-2, a blameless PIR MUST be conducted; timeline, root cause, and action items documented.
- **Action items:** Fixes, runbook updates, and preventive measures assigned and tracked.
- **Error budget:** Consumption recorded; policy (error-budgets.md) applied.

---

## 4. Escalation Policies

- **On-call:** Primary and secondary on-call MUST be defined for platform/engine scope; rotation and handoff MUST be documented.
- **Escalation path:** SEV-1 → immediate escalation to incident commander and (per policy) leadership; SEV-2 → escalation within SLA (e.g., 1 hour).
- **Runbooks:** Common failure modes MUST have runbooks (see runbooks.md) so that responders can execute mitigation quickly.

---

## 5. References

- [slo.md](./slo.md)
- [error-budgets.md](./error-budgets.md)
- [runbooks.md](./runbooks.md)
- [dr.md](./dr.md)
- [engine-core/specs/engine-failure-model.md](../engine-core/specs/engine-failure-model.md)
