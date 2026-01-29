# Nexus Loan Engine — Product Architecture

---

## Conceptual architecture (product view)

This document describes **product** architecture: how the product is conceived, what it owns, and how it relates to the platform. It is not a technical system design.

---

## Product layer

**Nexus Loan Engine** is a product layer on top of the Nexus platform:

- **Platform**: Decision engines, intelligence, optimization, trust, APIs, infra.  
- **Loan Engine product**: Lending experience, application → decision → explanation, policy framing, lender and applicant value.  

Loan Engine **uses** the platform for decisioning; it **owns** the lending product experience and domain scope.

---

## Product components (conceptual)

| Component | Responsibility |
|-----------|-----------------|
| **Application intake** | Accept application data; validate and shape for decision. |
| **Decision orchestration** | Invoke platform decision; map to lending outcomes (approve/decline/refer). |
| **Explanation** | Present “why” in product terms (applicant and lender). |
| **Policy & config** | Lending-specific policy, limits, referral rules (product-level config). |
| **Lender experience** | Config, monitoring, audit views. |
| **Applicant experience** | Outcome and reason (often via lender’s channel). |

These are **product concepts**. Implementation may map them to services, APIs, or UI owned by the product or platform.

---

## Domain ownership

- **Loan Engine owns**: Lending flow, outcome semantics, policy framing, product narrative, applicant/lender experience.  
- **Platform owns**: Core decision engine, ML/models, APIs, infra, security.  
- **External systems**: Origination, servicing, CRM—Loan Engine integrates; it does not replace them.  

---

## Boundaries

- **North**: Applicants (via lender) and lenders (operations, risk, tech).  
- **South**: Platform (decision API, explainability, trust).  
- **East/West**: Origination, servicing, identity—integrations; product defines contracts and experience.  

---

*This is product architecture. Technical architecture must respect these boundaries.*
