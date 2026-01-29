# Nexus Playground — Product Scope

---

## In scope

| Area | Description |
|------|-------------|
| **Demo experiences** | Curated flows that show decision intelligence (e.g., sample loan, hiring, fraud scenarios). |
| **Sample data & scenarios** | Synthetic or anonymized data and predefined cases for exploration. |
| **Exploration UI** | Interfaces for running scenarios, viewing results, and comparing outcomes. |
| **Product narrative** | Storyline: what the platform is, what problems it solves, how it fits into products. |
| **Guided tours** | Step-by-step paths for first-time users (investors, clients, engineers). |
| **Capability showcase** | Demonstrations of reasoning, explainability, optimization, trust signals. |

## Out of scope

| Area | Reason |
|------|--------|
| **Production decisions** | Playground is for demo/exploration only; no real business outcomes. |
| **Real customer data** | Only sample/synthetic data; no PII or live systems. |
| **Billing & entitlements** | Monetization and access control belong to platform/SaaS, not Playground product. |
| **Multi-tenant admin** | Tenant management is platform concern, not Playground product scope. |
| **Engine implementation** | Engines are platform; Playground consumes and showcases them. |
| **Custom product logic** | Loan/hiring/fraud product logic lives in their product boundaries. |

## Boundaries

- **Playground** = experience + narrative + demo scenarios.  
- **Platform** = engines, APIs, infra, security.  
- **Other products** = Loan Engine, Hiring Engine, Fraud Engine own their domain and flows; Playground only *demonstrates* them.  

## Evolution of scope

- New demo scenarios can be added as we add platform capabilities or new products.  
- Scope expands only with explicit product intent (e.g., “Playground supports investor report export”) and stays within the “demo & exploration” identity.  

---

*Scope defines what the product owns and what it does not. Technical implementation follows this scope.*
