# Nexus Loan Engine — Integration Map

---

## Purpose

This map describes **how the Loan Engine product relates** to the platform and external systems from a product perspective. It is not an API or system integration spec.

---

## Platform

| Platform capability | Loan Engine use |
|---------------------|-----------------|
| **Decision / intelligence** | Core decision for each application; Loan Engine maps to approve/decline/refer. |
| **Explainability** | Used to produce applicant- and lender-facing reasons. |
| **Trust / confidence** | May drive referral or display (e.g., confidence score). |
| **Optimization** | Optional: limit/term optimization within product scope. |
| **APIs & infra** | Loan Engine consumes platform APIs; does not implement engines. |

Loan Engine **consumes** platform; it does not replace or duplicate platform logic.

---

## External systems (product view)

| System | Relationship |
|--------|--------------|
| **Origination** | Sends application to Loan Engine; receives decision + explanation. Product defines contract and semantics. |
| **Servicing** | Post-decision; Loan Engine may pass offer/contract reference. Not decision scope. |
| **Identity / KYC** | May supply inputs to decision; product defines what is required, not how identity is implemented. |
| **CRM / lender ops** | May consume decisions and explanations; product defines what is exposed. |

Loan Engine is the **decision product**; origination and servicing remain in lender or partner systems.

---

## Other products

| Product | Relationship |
|---------|--------------|
| **Nexus Playground** | Playground runs *demo* loan scenarios that illustrate Loan Engine; no production logic in Playground. |
| **Nexus Hiring Engine** | Separate product; no shared domain logic. |
| **Nexus Fraud Engine** | Separate product; may share platform, not lending scope. |

---

## Out of scope

- **Billing / entitlements**: Platform or SaaS.  
- **Tenant management**: Platform.  
- **Core engine code**: Platform.  

---

*Integration map defines product relationships. Technical integration details live in platform and product implementation docs.*
