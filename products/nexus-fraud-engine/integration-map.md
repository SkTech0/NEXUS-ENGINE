# Nexus Fraud Engine — Integration Map

---

## Purpose

This map describes **how the Fraud Engine product relates** to the platform and external systems from a product perspective. It is not an API or system integration spec.

---

## Platform

| Platform capability | Fraud Engine use |
|---------------------|------------------|
| **Decision / intelligence** | Core risk assessment for each transaction or entity; Fraud Engine maps to flag/block/review. |
| **Explainability** | Used to produce operator- and auditor-facing reasons. |
| **Trust / confidence** | May drive referral or display (e.g., confidence score). |
| **Optimization** | Optional: threshold or rule tuning within product scope. |
| **APIs & infra** | Fraud Engine consumes platform APIs; does not implement engines. |

Fraud Engine **consumes** platform; it does not replace or duplicate platform logic.

---

## External systems (product view)

| System | Relationship |
|--------|--------------|
| **Payment / core banking** | Sends transaction to Fraud Engine; receives score + flags + explanation. Product defines contract and semantics. |
| **Onboarding / identity** | May send entity or account data; product defines what is required, not how identity is implemented. |
| **GovTech / benefits** | May send claim or entity; product defines contract. |
| **SaaS / abuse** | May send event or user; product defines contract. |
| **Risk ops / SIEM** | May consume scores and explanations; product defines what is exposed. |

Fraud Engine is the **decision product**; payment, onboarding, and core systems remain in FinTech/GovTech/SaaS.

---

## Other products

| Product | Relationship |
|---------|--------------|
| **Nexus Playground** | Playground runs *demo* fraud scenarios that illustrate Fraud Engine; no production logic in Playground. |
| **Nexus Loan Engine** | Separate product; no shared domain logic. |
| **Nexus Hiring Engine** | Separate product; no shared domain logic. |

---

## Out of scope

- **Billing / entitlements**: Platform or SaaS.  
- **Tenant management**: Platform.  
- **Core engine code**: Platform.  

---

*Integration map defines product relationships. Technical integration details live in platform and product implementation docs.*
