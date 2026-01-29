# Nexus Fraud Engine — Product Architecture

---

## Conceptual architecture (product view)

This document describes **product** architecture: how the product is conceived, what it owns, and how it relates to the platform. It is not a technical system design.

---

## Product layer

**Nexus Fraud Engine** is a product layer on top of the Nexus platform:

- **Platform**: Decision engines, intelligence, optimization, trust, APIs, infra.  
- **Fraud Engine product**: Fraud/risk experience, transaction/entity → assessment → score/flags → explanation, policy framing, risk team and operator value.  

Fraud Engine **uses** the platform for decisioning; it **owns** the fraud/risk product experience and domain scope.

---

## Product components (conceptual)

| Component | Responsibility |
|-----------|-----------------|
| **Transaction/entity intake** | Accept transaction or entity data; validate and shape for assessment. |
| **Assessment orchestration** | Invoke platform decision; map to risk outcomes (flag/block/review). |
| **Explanation** | Present “why” in product terms (operator and auditor). |
| **Policy & thresholds** | Risk-specific thresholds, rules, actions (product-level config). |
| **Risk team experience** | Config, monitoring, audit views. |
| **Operator experience** | Score, flags, reason, and optional action (block/allow/escalate). |

These are **product concepts**. Implementation may map them to services, APIs, or UI owned by the product or platform.

---

## Domain ownership

- **Fraud Engine owns**: Fraud/risk flow, outcome semantics, threshold framing, product narrative, risk team/operator experience.  
- **Platform owns**: Core decision engine, ML/models, APIs, infra, security.  
- **External systems**: Payment, onboarding, core banking—Fraud Engine integrates; it does not replace them.  

---

## Boundaries

- **North**: Risk operators, risk teams, compliance (and indirectly end users).  
- **South**: Platform (decision API, explainability, trust).  
- **East/West**: Payment, onboarding, identity—integrations; product defines contracts and experience.  

---

*This is product architecture. Technical architecture must respect these boundaries.*
