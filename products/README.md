# Products

**Product-first layer for Nexus.**

---

## Purpose

This directory defines **products** as first-class entities. Products are the user-facing value layer: they define what the product is, who it is for, what problem it solves, and how it evolves. The platform (engines, infra, tooling) powers products; products own the experience, narrative, and market.

---

## Architecture principle

| Layer | Responsibility |
|-------|----------------|
| **Platform** | Engines, infra, APIs, security, tooling. |
| **Domain** | Intelligence logic, decision core. |
| **Product** | User experience, value, story, market. |

Products are **additive** and **non-breaking**. No code was moved, no refactor, no restructure. This is conceptual + structural—product foundation for the future.

---

## Product structure

| Product | Purpose | Audience |
|---------|---------|----------|
| **[nexus-playground](./nexus-playground/)** | Demo & exploration platform | Engineers, investors, clients, demos |
| **[nexus-loan-engine](./nexus-loan-engine/)** | FinTech decision product | Banks, NBFCs, FinTechs |
| **[nexus-hiring-engine](./nexus-hiring-engine/)** | HRTech decision product | HR teams, enterprises |
| **[nexus-fraud-engine](./nexus-fraud-engine/)** | RiskTech product | FinTech, GovTech, SaaS |

---

## Per-product documentation

Each product folder contains:

- **README.md** — What the product is, who it’s for, value, scope.  
- **product-vision.md** — Vision, strategic intent, long-term direction.  
- **product-scope.md** — In scope, out of scope, boundaries.  
- **product-flows.md** — How users interact (primary flows).  
- **user-personas.md** — Who the product serves.  
- **use-cases.md** — What users achieve (product-level).  
- **demo-scenarios.md** — Curated demo experiences (where applicable).  
- **product-architecture.md** — Product-layer architecture and boundaries.  
- **integration-map.md** — How the product relates to platform and others.  
- **roadmap.md** — Product evolution themes (direction, not commitments).  

These are **product docs**, not technical specs. They define identity, direction, and boundaries—not implementation.

---

## What this is not

- **Not** a refactor or restructure.  
- **Not** moving or changing existing code.  
- **Not** touching platform engines, UI, APIs, infra, or configs.  

Only: product directory, product folders, documentation, and product concepts.

---

## Outcome

The repo now has:

- Clear **Platform vs Product** separation.  
- Clear **Product identity** and **direction**.  
- Clear **Product boundaries** and **evolution paths**.  
- A **product-first** architecture mindset.  
- A **future SaaS-ready** structure.  

This is **product foundation**—conceptual and structural.
