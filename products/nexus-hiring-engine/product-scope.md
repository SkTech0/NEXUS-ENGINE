# Nexus Hiring Engine — Product Scope

---

## In scope

| Area | Description |
|------|-------------|
| **Hiring evaluation flow** | End-to-end experience: candidate/role input → evaluation → recommendation and explanation. |
| **Recommendation outcomes** | Shortlist, interview, hire (and product-defined variants). |
| **Explainability** | “Why this recommendation?” for hiring manager and (where allowed) candidate. |
| **Role & criteria framing** | Product-level framing of role fit, skills, and criteria (configuration, not engine code). |
| **Hiring manager experience** | How hiring managers configure, run, and use the product. |
| **Candidate experience** | How candidates see outcome and (where in scope) reason or feedback. |
| **Product narrative** | Value proposition, positioning, and feature set for hiring. |

## Out of scope

| Area | Reason |
|------|--------|
| **Core engine implementation** | Engines are platform; Hiring Engine consumes them. |
| **Generic APIs/infra** | Platform responsibility. |
| **Loan / fraud logic** | Other products. |
| **Playground demos** | Playground product; Hiring Engine may be *shown* there. |
| **Billing / tenant admin** | Platform or SaaS layer. |
| **ATS / HRIS** | Hiring Engine is decision product; ATS/HRIS are separate systems the product may integrate with. |

## Boundaries

- **Hiring Engine** = hiring decision product: experience, scope, criteria framing, narrative.  
- **Platform** = engines, APIs, infra, security.  
- **ATS/HRIS** = external systems; Hiring Engine integrates via product-defined contracts.  

## Evolution of scope

- New hiring features (e.g., skills-based, diversity-aware) expand product scope by explicit product decision.  
- Scope stays within “hiring decision product”; we do not absorb generic platform or other domains.  

---

*Scope defines what the product owns and what it does not. Technical implementation follows this scope.*
