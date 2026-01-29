# Error Budgets

**Status:** Standard  
**Owner:** Platform Operations  
**Classification:** Ops — Error Budget  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS uses error budgets to balance reliability and velocity. Error budgets are derived from SLOs and drive release gates, incident response, and prioritization of reliability work.

---

## 2. Definition

- **Error budget:** The allowable amount of unreliability within an SLO window. Example: 99.9% availability SLO → 0.1% error budget → 43.2 minutes of downtime per 30 days.
- **Consumption:** Every SLO violation (failed request, timeout, outage) consumes the error budget.
- **Exhaustion:** When the error budget is exhausted (or burn rate is high), the platform MUST prioritize reliability over new features (see policy below).

---

## 3. Policy

### 3.1 When Budget Is Healthy

- Normal release and feature velocity; reliability work is balanced with product work.
- Proactive reliability improvements (e.g., testing, hardening) are encouraged.

### 3.2 When Budget Is Consumed (e.g., > 50%)

- Increase focus on reliability: pause or slow non-essential releases; prioritize fixes and mitigations.
- Post-incident reviews and action items MUST be completed before resuming normal velocity.

### 3.3 When Budget Is Exhausted (100%)

- **Freeze:** No new features or non-critical changes to the affected scope until budget is restored (e.g., next window) or SLO is renegotiated.
- **Remediation:** All effort on reliability: incident resolution, root cause fix, and prevention.
- **Escalation:** Leadership and product MUST be informed; decision to renegotiate SLO or extend freeze is documented.

---

## 4. Restoration

- **Time-based:** Error budget typically resets at the start of each SLO window (e.g., monthly).
- **Allocation:** Some organizations allocate a portion of budget to planned maintenance; MUST be documented and excluded from “unplanned” consumption.
- **Carry-over:** Policy MAY allow carry-over of unused budget (e.g., for planned maintenance); MUST be documented.

---

## 5. Reporting and Visibility

- Error budget consumption MUST be visible in dashboards (e.g., remaining budget, burn rate).
- Alerts SHOULD fire when burn rate would exhaust budget before end of window (e.g., 2-hour burn rate).
- Regular (e.g., weekly) review of error budget and consumption MUST be part of operations rhythm.

---

## 6. References

- [slo.md](./slo.md)
- [sli.md](./sli.md)
- [incident-response.md](./incident-response.md)
- [gates/platform-readiness-gate.md](../gates/platform-readiness-gate.md)
