# Start Here

Welcome. This file is the first thing you should read. It tells you what this repo is, how to think about it, and where to go next—without drowning you in detail.

---

## What this repo is

**Nexus Engine** is a decision-intelligence platform. It provides engines (data, intelligence, optimization, AI, trust, distributed coordination) that power **products**—things like loan decisioning, hiring, fraud detection, and a playground for demos.

Think of it as: **one platform, many products**. The platform does the heavy lifting; products define the experience and the market.

---

## What problem it solves

Organizations need to make decisions at scale—who gets a loan, who to hire, what’s fraudulent—in a way that is fast, consistent, explainable, and controllable. Nexus provides the core machinery (engines, APIs, UI shell) so that product teams can focus on domain logic, flows, and user value instead of rebuilding infra from scratch.

---

## What kind of system it is

- **Monorepo** (Nx): one repo, many apps and libraries.
- **Multi-runtime**: TypeScript/Node (core, UI, SaaS), .NET (API gateway), Python (AI/data engines).
- **Layered**: Core → Engines → API → UI / SaaS / Monetization / Platform / Enterprise.
- **Product-first**: Products are first-class; they sit on top of the platform and define what users see and do.

---

## High-level structure (mental map)

```
You are here (repo root)
│
├── START_HERE.md          ← you are reading this
├── DEV_GUIDE.md           ← how to run, test, contribute
├── PRODUCT_GUIDE.md       ← what products exist and how they relate
├── ARCH_OVERVIEW.md       ← system mental model and flows
│
├── engine-core/           ← domain, interfaces, contracts (no UI, no HTTP)
├── engine-*               ← engines: data, intelligence, optimization, AI, trust, distributed
├── engine-api/            ← .NET HTTP gateway (the API you call)
├── product-ui/            ← Angular app (demos + dashboards)
├── products/              ← product definitions (docs, scope, vision—not runtime code)
├── platform/              ← plugins, extensions, integrations
├── saas-layer/            ← tenancy, auth, billing hooks
├── monetization/          ← pricing, billing, invoicing
├── enterprise/            ← compliance, governance, policies
├── infra/                 ← Docker, K8s, CI/CD
└── docs/                  ← engineering, investor, legal, research (not runtime)
```

**Core idea:** `engine-core` defines *what* engines do (interfaces, contracts). The `engine-*` folders implement those contracts. `engine-api` exposes them over HTTP. `product-ui` is the main UI that talks to the API. Products in `products/` define *what* we build for users; they don’t replace the code in engine-api or product-ui—they own the narrative and scope.

---

## How to mentally model the repo

1. **Platform vs product**  
   Platform = engines, API, UI shell, infra. Product = user-facing value (loan engine, hiring engine, playground, etc.). Products use the platform; they don’t replace it.

2. **Layers**  
   Core (domain only) → Engines (implement core) → Gateway (API) → Presentation (UI) and other consumers (SaaS, platform, enterprise). Dependencies point inward; core doesn’t know about HTTP or Angular.

3. **Engines are capabilities**  
   Each engine (data, intelligence, optimization, AI, trust, distributed) is a capability. The API and products compose these capabilities into flows (e.g. “submit application → score → decide → explain”).

4. **Products are additive**  
   The `products/` directory is mostly documentation and scope. Adding a product = adding a folder under `products/` and, when needed, domain slices in the API and demo routes in the UI. No big-bang refactor.

---

## Where to start

1. **Read this file** (you’re doing it).
2. **Skim** [ARCH_OVERVIEW.md](./ARCH_OVERVIEW.md) for the layered view and flows (5–10 minutes).
3. **Run the system** using [DEV_GUIDE.md](./DEV_GUIDE.md): install deps, start API, start UI, open the app.
4. **Click around** the UI: landing, playground, loan demo (apply → evaluate → decision). That’s the main “product” path you’ll care about at first.
5. **Read** [PRODUCT_GUIDE.md](./PRODUCT_GUIDE.md) to see how demos map to products and how products use the platform.

After that, go deeper where you need to: engine you’re changing, API controller, or product doc.

---

## What to ignore initially

- **docs/** (investor, legal, thesis, papers)—useful later, not for “how does the system run.”
- **reports/**, **benchmarks/**, **versioning/**—come back when you need them.
- **DEPENDENCY_GRAPH.md**, **ARCHITECTURE_MAP.md**—reference only; use ARCH_OVERVIEW.md for the mental model.
- **Infra and CI/CD**—run locally first; then read `docs/engineering/` or `infra/` when you care about deployment.

Don’t try to read every engine or every product doc on day one. Get the map, run the app, then follow your task.

---

## How to explore safely

- **Read-only first:** Open files, read routes, trace one flow (e.g. loan apply → API → response). Don’t change code until you know the path.
- **One layer at a time:** Understand UI → API → one engine before jumping to another engine.
- **Use the docs you’re creating:** START_HERE → ARCH_OVERVIEW → DEV_GUIDE → PRODUCT_GUIDE. They’re designed so you can stop at any step and still have a coherent picture.
- **Tests:** Run tests (see DEV_GUIDE). If you change something, run the relevant tests before and after.

---

## How not to break things

- **Don’t move or rename** core folders (engine-core, engine-*, engine-api, product-ui) without a clear plan and team alignment. These docs are additive; they don’t require restructuring.
- **Don’t add dependencies from core to UI or API.** Core stays dependency-free; engines depend on core, not the other way around.
- **Don’t put product-specific business logic in engine-core.** Core = interfaces and domain concepts; product logic lives in engine-api (e.g. Domain/Loan) or product-ui (demo flows).
- **Do run lint and tests** after changes. Use the scripts in DEV_GUIDE.

---

## Learning path (short)

| Step | Action | Outcome |
|------|--------|--------|
| 1 | Read START_HERE (this file) | You know what the repo is and how it’s structured. |
| 2 | Read ARCH_OVERVIEW | You have a mental model: layers, engines, flows. |
| 3 | Follow DEV_GUIDE to run API + UI | You can run the system locally. |
| 4 | Use the UI: landing → playground → loan flow | You see how a product flow works end-to-end. |
| 5 | Read PRODUCT_GUIDE | You know what products exist and how they map to demos and platform. |
| 6 | Pick one area (e.g. loan API, one engine) and trace one request | You can contribute with context. |

---

## Navigation map (where to find things)

| I want to… | Look here |
|------------|-----------|
| Understand the system in 10 minutes | START_HERE.md, ARCH_OVERVIEW.md |
| Run the app and API | DEV_GUIDE.md |
| Understand products and demos | PRODUCT_GUIDE.md, products/*/README.md |
| Change API endpoints | engine-api/src/EngineApi/Controllers/, Domain/ |
| Change UI routes or demo flows | product-ui/src/app/app.routes.ts, demo/ |
| Understand engine contracts | engine-core/src/interfaces/, contracts/ |
| Add or evolve a product | products/ (new folder + docs), then API/UI as needed |
| See detailed architecture | ARCHITECTURE_MAP.md, DEPENDENCY_GRAPH.md |
| See CI/CD, quality, release | docs/engineering/, quality/, release/ |

---

## Conceptual layers (recap)

- **Core:** Domain and contracts only. No HTTP, no UI.
- **Engines:** Implement core; provide data, intelligence, optimization, AI, trust, distribution.
- **Gateway:** engine-api—HTTP entrypoint to engines.
- **Presentation:** product-ui—demos and dashboards.
- **Product:** products/—what we build for users; product docs and scope.
- **SaaS / Monetization / Platform / Enterprise:** Built on top of the gateway and engines; don’t replace core or engines.

You’re ready to open [DEV_GUIDE.md](./DEV_GUIDE.md) and run the system, or [ARCH_OVERVIEW.md](./ARCH_OVERVIEW.md) to lock in the mental model. Welcome aboard.
