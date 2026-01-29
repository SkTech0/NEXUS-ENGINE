# Nexus Hiring Engine — Product Architecture

---

## Conceptual architecture (product view)

This document describes **product** architecture: how the product is conceived, what it owns, and how it relates to the platform. It is not a technical system design.

---

## Product layer

**Nexus Hiring Engine** is a product layer on top of the Nexus platform:

- **Platform**: Decision engines, intelligence, optimization, trust, APIs, infra.  
- **Hiring Engine product**: Hiring experience, candidate → evaluation → recommendation → explanation, criteria framing, HR and candidate value.  

Hiring Engine **uses** the platform for decisioning; it **owns** the hiring product experience and domain scope.

---

## Product components (conceptual)

| Component | Responsibility |
|-----------|-----------------|
| **Candidate & role intake** | Accept candidate and role data; validate and shape for evaluation. |
| **Evaluation orchestration** | Invoke platform decision; map to hiring outcomes (shortlist/interview/hire/refer). |
| **Explanation** | Present “why” in product terms (hiring manager and, where allowed, candidate). |
| **Criteria & config** | Role- and criteria-specific config (product-level). |
| **Hiring manager experience** | Config, recommendations, monitoring, audit views. |
| **Candidate experience** | Outcome and (where in scope) reason or feedback. |

These are **product concepts**. Implementation may map them to services, APIs, or UI owned by the product or platform.

---

## Domain ownership

- **Hiring Engine owns**: Hiring flow, recommendation semantics, criteria framing, product narrative, hiring manager/candidate experience.  
- **Platform owns**: Core decision engine, ML/models, APIs, infra, security.  
- **External systems**: ATS, HRIS—Hiring Engine integrates; it does not replace them.  

---

## Boundaries

- **North**: Candidates (via ATS/employer) and hiring managers/HR.  
- **South**: Platform (decision API, explainability, trust).  
- **East/West**: ATS, HRIS, identity—integrations; product defines contracts and experience.  

---

*This is product architecture. Technical architecture must respect these boundaries.*
