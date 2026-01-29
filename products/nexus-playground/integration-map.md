# Nexus Playground — Integration Map

---

## Purpose

This map describes **how the Playground product relates** to the platform and other products from a product perspective. It is not an API or system integration spec.

---

## Platform

| Platform capability | Playground use |
|--------------------|----------------|
| **Decision / intelligence** | Playground invokes or simulates decisions for demo scenarios. |
| **Explainability** | Playground surfaces explanations as part of the demo narrative. |
| **Trust / confidence** | Playground may show trust scores or confidence when it supports the story. |
| **Optimization** | Playground may demonstrate optimization views where relevant. |
| **APIs** | Playground uses platform (or demo) endpoints to run scenarios; no production APIs with real data. |

Playground **consumes** platform; it does not extend or replace platform logic.

---

## Other products

| Product | Relationship |
|---------|--------------|
| **Nexus Loan Engine** | Playground runs *demo* loan scenarios that illustrate Loan Engine value. No production loan logic in Playground. |
| **Nexus Hiring Engine** | Playground runs *demo* hiring scenarios that illustrate Hiring Engine value. |
| **Nexus Fraud Engine** | Playground runs *demo* fraud scenarios that illustrate Fraud Engine value. |

Playground is a **showcase** for these products. Handoff from Playground to a real product (e.g., “Get Nexus Loan Engine”) is a product/GTM concern, not an engine dependency.

---

## External (out of scope for Playground product)

- **CRM / sales tools**: Integration for “contact us” or “request demo” is GTM/ops, not Playground product scope.  
- **Analytics**: Usage of Playground may be measured for product insight; that is platform/analytics concern.  
- **Auth / SSO**: If Playground ever requires login, that is platform identity; Playground product defines *who* gets what experience, not how auth works.  

---

*Integration map defines product relationships. Technical integration details live in platform and product implementation docs.*
