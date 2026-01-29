# Enterprise Gate

**Status:** Standard  
**Owner:** Product / Platform Architecture  
**Classification:** Gates — Enterprise  
**Version:** 1.0

---

## 1. Purpose

This gate defines the criteria that must be met before NEXUS is declared ready for enterprise and regulated-industry sales: multi-tenant isolation, SSO, audit, compliance, support, and commercial/legal terms. Passage of this gate is required for enterprise contracts and regulated-industry deployment.

---

## 2. Gate Criteria

### 2.1 Market Entry Prerequisite

- [ ] Market entry gate passed (gates/market-entry-gate.md); commercial launch criteria met for baseline scope.

### 2.2 Multi-Tenant and Isolation (Enterprise)

- [ ] Tenant isolation verified by test and (where required) audit; no cross-tenant data or execution; tenant identity in every request.
- [ ] Per-tenant quotas and resource limits; overage handling and upgrade path; tenant admin and member roles.
- [ ] Data residency and region choice (where required); cross-border transfer (e.g., SCCs) documented and available.

### 2.3 Identity and Access (Enterprise)

- [ ] SSO and federated identity (SAML 2.0, OIDC) for enterprise customers; IdP integration and provisioning.
- [ ] RBAC/ABAC with enterprise roles (admin, member, viewer) and custom roles where supported.
- [ ] Audit log of access and authz decisions; export or SIEM integration per contract; retention per compliance.

### 2.4 Compliance and Audit (Enterprise)

- [ ] Compliance readiness per market-readiness/compliance.md; control mapping and documentation for target regulations (e.g., SOC2, ISO 27001, sectoral).
- [ ] External audit or certification (e.g., SOC2 Type II, ISO 27001) where required by market or customer; certificate and report available.
- [ ] Audit support process (evidence, access, response); DPA and security addendum; sub-processor list and audit rights.
- [ ] Decision lineage and explainability per governance/data/decision-lineage.md; retention and export for regulator or auditor; determinism and consistency certification where required (ERL-6).

### 2.5 Support and SLAs (Enterprise)

- [ ] Enterprise support tiers (e.g., 24/7, dedicated CSM, TAM); response and resolution SLA per tier.
- [ ] SLA (availability, latency) committed in contract; error budget and incident response aligned; credit or remedy per SLA policy.
- [ ] Escalation path from support to engineering and leadership; customer communication for SEV-1/2; status page and incident communication.

### 2.6 Commercial and Legal (Enterprise)

- [ ] MSA and order form; custom terms and approval process where required (market-readiness/legal.md).
- [ ] DPA and security addendum; liability cap and indemnity; insurance (cyber, E&O) per risk and customer requirement.
- [ ] Vendor security questionnaire (e.g., SIG, CAIQ) and response; security and compliance documentation package for procurement.

### 2.7 Operational and DR (Enterprise)

- [ ] DR and RTO/RPO per ops/dr.md; committed in contract where required; DR drill evidence where required by customer.
- [ ] Runbooks and chaos standards per ops/; enterprise may require evidence of resilience and DR; data backup and restore tested.

---

## 3. Gate Process

- **Owner:** Product lead or GM; sign-off from platform architecture, engineering, security, legal, compliance, and (where applicable) sales.
- **Evidence:** Checklist above with evidence (market-entry gate passage, compliance docs, certifications, legal templates, runbooks); gaps and remediation plan if not fully met.
- **Pass:** All criteria met (or accepted exceptions documented); gate passed and date recorded.
- **Fail:** One or more criteria not met; remediation plan and re-gate date set; no enterprise/regulated sales until gate is passed.

---

## 4. Outcome

- **Pass:** NEXUS is declared ready for enterprise and regulated-industry sales for the defined scope; eligible for enterprise contracts and RFP responses.
- **Fail:** Not eligible for enterprise or regulated sales until gate is passed; standard commercial sales may proceed if market-entry gate is passed.

---

## 5. References

- [market-entry-gate.md](./market-entry-gate.md)
- [market-readiness/enterprise.md](../market-readiness/enterprise.md)
- [market-readiness/compliance.md](../market-readiness/compliance.md)
- [market-readiness/legal.md](../market-readiness/legal.md)
- [market-readiness/security.md](../market-readiness/security.md)
- [engine-core/readiness/erl-model.md](../engine-core/readiness/erl-model.md) (ERL-6)
- [security/engine/](../security/engine/)
- [governance/data/](../governance/data/)
- [ops/](../ops/)
