# Nexus Loan Engine — Product Scope

---

## In scope

| Area | Description |
|------|-------------|
| **Loan application flow** | End-to-end experience: application input → decision → outcome and explanation. |
| **Decision outcomes** | Approve, decline, refer (and product-defined variants). |
| **Explainability** | “Why this decision?” for applicant and lender; audit trail. |
| **Lending policy & rules** | Product-level framing of risk, limits, and policy (configuration, not engine code). |
| **Lender experience** | How lenders configure, monitor, and use the product. |
| **Applicant experience** | How applicants see outcome and reason (and optional next steps). |
| **Product narrative** | Value proposition, positioning, and feature set for lending. |

## Out of scope

| Area | Reason |
|------|--------|
| **Core engine implementation** | Engines are platform; Loan Engine consumes them. |
| **Generic APIs/infra** | Platform responsibility. |
| **Hiring / fraud logic** | Other products. |
| **Playground demos** | Playground product; Loan Engine may be *shown* there. |
| **Billing / tenant admin** | Platform or SaaS layer. |
| **Origination / servicing** | Loan Engine is decision product; origination and servicing are separate systems the product may integrate with. |

## Boundaries

- **Loan Engine** = lending decision product: experience, scope, policy framing, narrative.  
- **Platform** = engines, APIs, infra, security.  
- **Origination/servicing** = external systems; Loan Engine integrates via product-defined contracts.  

## Evolution of scope

- New lending features (e.g., BNPL flow, SME segment) expand product scope by explicit product decision.  
- Scope stays within “loan decision product”; we do not absorb generic platform or other domains.  

---

*Scope defines what the product owns and what it does not. Technical implementation follows this scope.*
