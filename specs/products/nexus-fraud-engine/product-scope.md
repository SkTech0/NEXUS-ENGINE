# Nexus Fraud Engine — Product Scope

---

## In scope

| Area | Description |
|------|-------------|
| **Fraud/risk assessment flow** | End-to-end experience: transaction or entity input → risk assessment → score/flags and explanation. |
| **Risk outcomes** | Flag, block, review (and product-defined variants). |
| **Explainability** | “Why flagged” for operator and auditor; audit trail. |
| **Risk policy & thresholds** | Product-level framing of thresholds, rules, and actions (configuration, not engine code). |
| **Risk team experience** | How risk teams configure, monitor, and use the product. |
| **Operator experience** | How operators see score, flags, and reason (and optional action). |
| **Product narrative** | Value proposition, positioning, and feature set for fraud/risk. |

## Out of scope

| Area | Reason |
|------|--------|
| **Core engine implementation** | Engines are platform; Fraud Engine consumes them. |
| **Generic APIs/infra** | Platform responsibility. |
| **Loan / hiring logic** | Other products. |
| **Playground demos** | Playground product; Fraud Engine may be *shown* there. |
| **Billing / tenant admin** | Platform or SaaS layer. |
| **Payment / core banking** | Fraud Engine is decision product; payment and core systems are separate systems the product may integrate with. |

## Boundaries

- **Fraud Engine** = fraud/risk decision product: experience, scope, policy framing, narrative.  
- **Platform** = engines, APIs, infra, security.  
- **Payment / core systems** = external systems; Fraud Engine integrates via product-defined contracts.  

## Evolution of scope

- New risk features (e.g., identity fraud, benefits fraud, abuse) expand product scope by explicit product decision.  
- Scope stays within “fraud/risk decision product”; we do not absorb generic platform or other domains.  

---

*Scope defines what the product owns and what it does not. Technical implementation follows this scope.*
