# Nexus Hiring Engine — Integration Map

---

## Purpose

This map describes **how the Hiring Engine product relates** to the platform and external systems from a product perspective. It is not an API or system integration spec.

---

## Platform

| Platform capability | Hiring Engine use |
|--------------------|-------------------|
| **Decision / intelligence** | Core evaluation for each candidate; Hiring Engine maps to shortlist/interview/hire/refer. |
| **Explainability** | Used to produce hiring manager- and (where allowed) candidate-facing reasons. |
| **Trust / confidence** | May drive referral or display (e.g., confidence score). |
| **Optimization** | Optional: ranking or prioritization within product scope. |
| **APIs & infra** | Hiring Engine consumes platform APIs; does not implement engines. |

Hiring Engine **consumes** platform; it does not replace or duplicate platform logic.

---

## External systems (product view)

| System | Relationship |
|--------|--------------|
| **ATS** | Sends candidate + role to Hiring Engine; receives recommendation + explanation. Product defines contract and semantics. |
| **HRIS** | May supply role or org data; product defines what is required, not how HRIS is implemented. |
| **Identity / SSO** | May supply user context; product defines who gets what experience, not how auth works. |
| **HR ops / analytics** | May consume recommendations and explanations; product defines what is exposed. |

Hiring Engine is the **decision product**; ATS and HRIS remain in enterprise or partner systems.

---

## Other products

| Product | Relationship |
|---------|--------------|
| **Nexus Playground** | Playground runs *demo* hiring scenarios that illustrate Hiring Engine; no production logic in Playground. |
| **Nexus Loan Engine** | Separate product; no shared domain logic. |
| **Nexus Fraud Engine** | Separate product; may share platform, not hiring scope. |

---

## Out of scope

- **Billing / entitlements**: Platform or SaaS.  
- **Tenant management**: Platform.  
- **Core engine code**: Platform.  

---

*Integration map defines product relationships. Technical integration details live in platform and product implementation docs.*
