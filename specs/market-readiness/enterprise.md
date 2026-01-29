# Enterprise Readiness for Market

**Status:** Standard  
**Owner:** Platform Architecture / Product  
**Classification:** Market Readiness — Enterprise  
**Version:** 1.0

---

## 1. Purpose

This document defines when NEXUS is enterprise-ready: multi-tenant isolation, SSO, audit, compliance, support, and commercial terms. Enterprise readiness is required for enterprise sales and regulated-industry deployment.

---

## 2. Enterprise Readiness Criteria

### 2.1 Multi-Tenant and Isolation

- **Tenant isolation:** Data, config, and execution fully isolated per tenant; no cross-tenant access; verified by test and audit (platform readiness, security/authz).
- **Tenant identity:** Tenant identity in every request; used for authz, lineage, and billing; tenant admin and member roles.
- **Resource and quota:** Per-tenant quotas (API rate, storage, compute) configurable and enforced; overage handling and upgrade path.

### 2.2 Identity and Access (Enterprise)

- **SSO / SAML / OIDC:** Single sign-on (SSO) and federated identity (SAML 2.0, OIDC) for enterprise customers; IdP integration and provisioning.
- **RBAC / ABAC:** Role-based or attribute-based access control; enterprise roles (admin, member, viewer) and custom roles where supported.
- **Audit of access:** Access and authz decisions logged; audit log available to customer (e.g., export, SIEM integration) per contract.

### 2.3 Compliance and Audit

- **Compliance:** Compliance readiness per market-readiness/compliance.md; control mapping and documentation for target regulations (e.g., SOC2, ISO 27001, sectoral).
- **Audit support:** Audit support (evidence, access, response) per compliance.md; DPA and security addendum for enterprise.
- **Lineage and explainability:** Decision lineage and explainability per governance/data/decision-lineage.md; retention and export for regulator or auditor.

### 2.4 Support and SLAs

- **Support tiers:** Enterprise support tiers (e.g., 24/7, dedicated CSM, TAM); response and resolution SLA per tier.
- **SLA:** SLA (availability, latency) committed in contract; error budget and incident response aligned; credit or remedy per SLA policy.
- **Escalation:** Escalation path from support to engineering and leadership; customer communication for SEV-1/2.

### 2.5 Commercial and Legal

- **MSA and order form:** Master service agreement (MSA) and order form; custom terms where required (legal readiness, market-readiness/legal.md).
- **DPA and security addendum:** DPA and security addendum; sub-processor list and audit rights.
- **Vendor review:** Vendor security questionnaire (e.g., SIG, CAIQ) and response; security and compliance documentation package for procurement.

### 2.6 Operational and DR

- **DR and RTO/RPO:** DR and RTO/RPO per ops/dr.md; committed in contract where required.
- **Runbooks and chaos:** Runbooks and chaos standards per ops/; enterprise may require evidence of DR drill and resilience.
- **Data residency:** Data residency and cross-border transfer options (e.g., region choice, SCCs) per legal and compliance.

---

## 3. Gate Alignment

- Enterprise readiness is the primary input to **Enterprise Gate** (gates/enterprise-gate.md).
- Technical, platform, ops, security, legal, and compliance readiness (market-readiness/*) are prerequisites; enterprise readiness aggregates and adds enterprise-specific criteria.

---

## 4. References

- [market-readiness/technical.md](./technical.md)
- [market-readiness/platform.md](./platform.md)
- [market-readiness/ops.md](./ops.md)
- [market-readiness/security.md](./security.md)
- [market-readiness/legal.md](./legal.md)
- [market-readiness/compliance.md](./compliance.md)
- [gates/enterprise-gate.md](../gates/enterprise-gate.md)
- [engine-core/readiness/erl-model.md](../engine-core/readiness/erl-model.md)
