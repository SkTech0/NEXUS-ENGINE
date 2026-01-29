# Nexus Playground — Product Architecture

---

## Conceptual architecture (product view)

This document describes **product** architecture: how the product is conceived, what it owns, and how it relates to the platform. It is not a technical system design.

---

## Product layer

**Nexus Playground** sits as a product layer on top of the Nexus platform:

- **Platform**: Engines (intelligence, optimization, trust, etc.), APIs, infra, security.  
- **Playground product**: Demo experiences, scenarios, narrative, exploration flows.  

Playground **uses** the platform; it does **not** implement engines or core logic. It composes platform capabilities into a product experience.

---

## Product components (conceptual)

| Component | Responsibility |
|-----------|-----------------|
| **Entry & narrative** | First impression, value proposition, “what you can do here.” |
| **Scenario selector** | Let user choose loan / hiring / fraud / platform overview. |
| **Demo runner** | Execute chosen scenario with sample data and show results. |
| **Result & explanation view** | Present decision, reasoning, and optional trust/optimization. |
| **Guided paths** | Optional step-by-step flows for investors and evaluators. |

These are **product concepts**, not necessarily single services or modules. Implementation may map them to UI, APIs, or shared platform endpoints.

---

## Domain ownership

- **Playground owns**: Demo content, scenario definitions, product narrative, exploration flow design.  
- **Platform owns**: Decision engines, APIs, data pipelines, infra.  
- **Other products own**: Loan/hiring/fraud domain logic; Playground only *invokes* or *demonstrates* them.  

---

## Boundaries

- **North**: Users (investors, clients, engineers, presenters) interact with Playground.  
- **South**: Playground calls platform (or product demo endpoints) for decisions; no direct engine code.  
- **East/West**: Playground does not implement billing, tenant management, or production product features.  

---

*This is product architecture. Technical architecture (services, repos, APIs) is defined elsewhere and must respect these boundaries.*
