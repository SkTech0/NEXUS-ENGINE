# Product Guide

What products exist, how they relate to the platform, and how to think about product evolution. This is product understanding—not technical implementation details.

---

## What products exist

| Product | Purpose | Audience |
|--------|---------|----------|
| **nexus-playground** | Demo and exploration | Engineers, investors, clients, demos |
| **nexus-loan-engine** | FinTech loan decisioning | Banks, NBFCs, FinTechs |
| **nexus-hiring-engine** | HRTech hiring decisions | HR teams, enterprises |
| **nexus-fraud-engine** | RiskTech fraud/risk | FinTech, GovTech, SaaS |

Each product lives under `specs/products/<product-name>/` as a **product definition**: README, vision, scope, flows, personas, use-cases, demo scenarios, integration map, roadmap. Implementation lives in the platform (engine-api, product-ui), not inside the product folder.

---

## What products will exist

The repo is set up for **additive** products. New products = new folder under `specs/products/` + docs, then (when needed) domain slices in the API and demo routes in the UI. There is no fixed list of “allowed” products; the structure supports loan, hiring, fraud, playground, and future domains (e.g. compliance, underwriting, pricing) as long as they fit the platform’s engine model.

---

## Product philosophy

- **Products are the user-facing value layer.** They define what we build for users: experience, narrative, and market.
- **Platform powers products.** Engines, API, UI shell, infra, and security are platform. Products use them; they don’t replace them.
- **Products are additive and non-breaking.** Adding a product does not require refactoring or moving existing code. It’s conceptual (product folder + docs) and, when needed, structural (new API domain, new UI routes).
- **Product identity lives in `specs/products/`.** Each product folder owns: what it is, who it’s for, what’s in scope, how it evolves. Implementation details stay in engine-api and product-ui.

---

## Product vs platform

| | Platform | Product |
|--|----------|--------|
| **What** | Engines, API, UI shell, infra, security, tooling | User-facing value: loan, hiring, fraud, playground |
| **Where** | engine-*, engine-api, product-ui, infra, saas-layer, etc. | specs/products/* (docs + scope); API/UI (domain and demo code) |
| **Owns** | How things run, scale, and integrate | What users see, do, and why they care |
| **Evolves** | Tech and capability upgrades | Features, flows, and roadmap |

Products **use** the platform. They don’t duplicate engine logic or infra; they define scope, flows, and narrative and consume platform capabilities via API and UI.

---

## Product lifecycle

1. **Define:** Create a folder under `specs/products/` with README, scope, vision, flows, personas, use-cases. No code required to “add” a product as a concept.
2. **Implement:** When building the product, add or extend domain code in engine-api (e.g. Domain/Loan) and demo/feature routes and components in product-ui. Reuse engines and API; don’t rebuild platform.
3. **Evolve:** Update product docs (roadmap, scope, flows) and implementation (API, UI) in small steps. Keep product boundaries clear so platform stays reusable.

---

## Product evolution

- **Roadmaps** live in each product folder (e.g. `specs/products/nexus-loan-engine/roadmap.md`). They express direction and themes, not commitments.
- **Scope** is in product-scope.md: in scope, out of scope, boundaries. Use it to decide what belongs to this product vs platform or other products.
- **Flows** are in product-flows.md: how users interact. Use them to align API and UI with the product story.

Evolution is additive: new features, new flows, new docs. Avoid moving or renaming core platform folders; extend instead.

---

## How demos map to products

The UI exposes **demos** that illustrate products:

| UI path / area | Product | Purpose |
|----------------|---------|--------|
| `/` (landing) | General | Entry and navigation |
| `/playground`, `/evaluate`, `/decision`, `/trust`, `/history` | **nexus-playground** | Platform exploration and demos |
| `/loan`, `/loan/apply`, `/loan/evaluate`, `/loan/decision`, `/loan/risk`, `/loan/history` | **nexus-loan-engine** | Loan application and decision flow |
| (Future) hiring routes | **nexus-hiring-engine** | Hiring evaluation and recommendation |
| (Future) fraud routes | **nexus-fraud-engine** | Fraud/risk flows |

Demos are the **visible** side of products. Product docs in `specs/products/` define the narrative and scope; demo routes and components in `product-ui/src/app/demo/` implement the experience.

---

## How domains map to products

- **Domain** = problem area (lending, hiring, fraud, general exploration).
- **Product** = the user-facing offering for that domain (nexus-loan-engine, nexus-hiring-engine, nexus-fraud-engine, nexus-playground).

One product can span one or more domains; one domain might be served by one product. The mapping is:

- Loan domain → nexus-loan-engine (product) → loan demo routes and API Domain/Loan.
- Hiring domain → nexus-hiring-engine → (future) hiring routes and API domain.
- Fraud domain → nexus-fraud-engine → (future) fraud routes and API domain.
- General exploration → nexus-playground → playground/evaluate/decision/trust/history routes.

Domain logic lives in the API (and optionally engines); product identity and scope live in `specs/products/`.

---

## How products use the platform

1. **API:** Products use engine-api as the gateway. Domain-specific controllers and services (e.g. Loan) call engines (intelligence, trust, optimization, AI) and return results. Products don’t replace the API; they use its endpoints and domain slices.
2. **UI:** product-ui hosts demo routes and components. Each product’s “face” is one or more routes and components under `app/demo/` (and shared components). The UI talks to the API; it doesn’t implement engines.
3. **Engines:** Products don’t own engines. They consume engine capabilities (scoring, decisioning, trust, optimization) through the API. New product needs = new or extended API domain and UI, not new core engines unless the platform itself is extending.

---

## Product roadmap thinking

- Roadmaps in `specs/products/*/roadmap.md` are **directional**: themes, opportunities, and possible features. They are not release plans or commitments.
- Use them to align: what we might build next, what’s in scope for this product, and what stays in platform or other products.
- When you add a feature, check the product’s scope and roadmap so the feature lands in the right product and doesn’t blur boundaries.

---

## Product ownership model

- **Product folder** = single source of truth for product identity, scope, flows, and evolution. Owned by product or domain lead.
- **API domain and UI demos** = implementation of that product on the platform. Owned by engineering; aligned with product docs.
- **Platform (engines, API gateway, infra)** = shared. No single product “owns” the platform; products consume it.

When in doubt: if it’s about **what we offer and why** → product docs. If it’s about **how it runs and how to extend it** → platform and [DEV_GUIDE.md](./DEV_GUIDE.md) / [ARCH_OVERVIEW.md](../architecture/ARCH_OVERVIEW.md).

---

You now have a clear picture of what products exist, how they relate to demos and domains, and how they use the platform. To run and change the system, see [DEV_GUIDE.md](./DEV_GUIDE.md). For the system mental model, see [ARCH_OVERVIEW.md](./ARCH_OVERVIEW.md).
