# Developer Guide

How to run the system locally, run tests, add features safely, and contribute. This is developer onboarding—not system specs or CI/CD details (those live in `docs/engineering/` and `infra/`).

---

## Prerequisites

- **Node.js 20+** (for Nx, Angular, product-ui)
- **.NET 10 SDK** (for engine-api)
- **Python 3.11+** (for engine-ai and other Python engines, if you run them)
- **Docker & Docker Compose** (optional; for running API/UI in containers)

---

## How to run the system locally

### 1. Install dependencies

From repo root:

```bash
npm install
```

### 2. Start the API (engine-api)

From repo root:

```bash
cd engine-api
dotnet restore
dotnet run --project src/EngineApi/EngineApi.csproj
```

- API: http://localhost:5000 (HTTP) / https://localhost:5001 (HTTPS)
- Swagger: https://localhost:5001/swagger or http://localhost:5000/swagger
- Health: GET http://localhost:5000/api/Health

Leave this terminal running.

### 3. Start the UI (product-ui)

From repo root, in a **second** terminal:

```bash
npx nx serve product-ui
```

- UI: http://localhost:4200 (or the port Nx prints)

Open the URL in a browser. The UI talks to the API; ensure the API is running if you use features that call it (e.g. loan flow, engine status).

### 4. Optional: run everything via Docker

From repo root:

```bash
docker-compose up -d
```

- engine-api: http://localhost:10021
- product-ui: http://localhost:10022

Adjust `product-ui` environment or proxy if it expects a different API URL.

---

## How to start services (summary)

| Service      | Command (from repo root) | Typical URL |
|-------------|---------------------------|-------------|
| engine-api  | `cd engine-api && dotnet run --project src/EngineApi/EngineApi.csproj` | http://localhost:5000 |
| product-ui  | `npx nx serve product-ui` | http://localhost:4200 |
| Full suite  | `./run-all.sh [BASE_URL]` (API must be up for engine flow) | — |

---

## How to run the UI

- **From root:** `npx nx serve product-ui`
- **From product-ui:** `npx ng serve` (if you have Angular CLI; node_modules at root)

API base URL is in `product-ui/src/environments/environment.ts` (and `environment.prod.ts`). Point it at your running API.

---

## How to run the API

- **From engine-api:** `dotnet run --project src/EngineApi/EngineApi.csproj`
- **With Swagger:** open http://localhost:5000/swagger (or 5001 for HTTPS)

---

## How to run engines

Engines are **libraries/services** consumed by the API and (for Python) may run as separate processes or be invoked by the API. For day-to-day dev:

- **TypeScript engines** (engine-core, engine-data, engine-intelligence, etc.): built and used via the Nx workspace; the API or product-ui may depend on them.
- **.NET API:** the main entrypoint; it calls engine logic (including Python services if configured). Running the API is the primary way to “run” the engine stack for local dev.
- **Python engines** (e.g. engine-ai): run according to their README; the API may call them over HTTP or in-process. Check `engine-ai/` (and similar) for run instructions.

**Smoke test (API must be running):**

```bash
./run-engine.sh [BASE_URL]
# Default BASE_URL: http://localhost:5000
```

This runs engine flow and API smoke tests.

---

## How to run tests

- **All projects (Nx):**  
  `npx nx run-many --target=test --all`

- **Single project (e.g. product-ui):**  
  `npx nx run product-ui:test`

- **engine-api (.NET):**  
  `cd engine-api && dotnet test`

- **Full suite (lint, build, test, engine flow, optional benchmarks):**  
  `./run-all.sh [BASE_URL]`

Run tests before and after making changes in the area you touched.

---

## How to debug

- **product-ui:** Use browser DevTools and Angular dev tools. Set breakpoints in the browser or in your IDE on the served app. Use `environment.ts` to point at a local or stub API.
- **engine-api:** Use your IDE’s .NET debugger (e.g. attach to the process or run with “Debug”). Set breakpoints in Controllers, Services, or Domain.
- **Engines:** If the engine is TypeScript, build and run tests with Nx; use Node/TS debugger as needed. For Python engines, use your IDE’s Python debugger on the relevant script or service.

---

## How to add features safely

1. **Identify the layer:** UI (product-ui), API (engine-api), or engine (engine-*).
2. **Preserve boundaries:**  
   - Don’t add UI or HTTP dependencies to engine-core.  
   - Don’t put product-specific business logic in engine-core; use engine-api Domain (e.g. Domain/Loan) or product-ui.
3. **Change one place at a time:** Prefer one PR per layer (e.g. API contract + one controller) so reviews and rollbacks are clear.
4. **Run tests:** Run the tests for the project you changed and any integration tests that hit your code path.
5. **Update docs if needed:** If you add a new product or a new major flow, consider a short note in PRODUCT_GUIDE or the product’s README; don’t duplicate technical specs.

---

## How to add domains

Domains are problem areas (e.g. loan, hiring, fraud). Conceptually:

- **Product:** Add or use a folder under `specs/products/` with README, scope, flows (see PRODUCT_GUIDE).
- **API:** Add domain-specific controllers and services under `engine-api/src/EngineApi/` (e.g. Domain/Loan). Keep gateway behavior in Controllers; put business logic in Services or Domain.
- **UI:** Add demo routes and components under `product-ui/src/app/demo/` (e.g. loan, hiring). Map routes in `app.routes.ts`.

Keep engine-core domain-agnostic; domain-specific rules and models live in the API and UI.

---

## How to add products

- **Product definition:** Create a folder under `specs/products/` (e.g. `specs/products/nexus-my-product/`). Add README, product-scope, product-flows, user-personas, use-cases, roadmap as needed (see `specs/products/nexus-loan-engine/` for a template).
- **Implementation:** Reuse the platform. Add or extend API domain (engine-api) and demo routes/components (product-ui) as needed. Products don’t replace the platform; they use it and define scope and narrative.

---

## Coding principles

- **Core has no outward dependencies.** engine-core does not depend on UI, API, or infra.
- **Dependencies point inward.** Engines depend on core; API depends on engines; UI depends on API (HTTP). No reverse dependency from core to API or UI.
- **Product logic stays out of core.** Core = interfaces, contracts, domain concepts. Product-specific logic lives in engine-api Domain and product-ui.
- **Consistent style:** Use existing ESLint/Prettier and .NET conventions. Run `npm run lint` and `npm run format` (or equivalent) before committing.

---

## Contribution flow

1. Create a branch for your change.
2. Make small, focused changes. Prefer one logical change per PR.
3. Run lint and tests for the affected projects.
4. Update docs only where necessary (e.g. new product, new run steps); avoid duplicating ARCHITECTURE_MAP or CI/CD docs.
5. Open a PR; link to START_HERE / DEV_GUIDE / PRODUCT_GUIDE if your change affects onboarding or product boundaries.

---

## Dev philosophy

- **Platform enables products.** Build and maintain the platform so products can ship without reimplementing engines or infra.
- **Clarity over cleverness.** Prefer clear structure and naming so the next developer can navigate quickly.
- **Additive over refactor.** These guides are additive. Prefer adding docs, endpoints, or modules over large restructures unless there’s a clear need.
- **Test what you change.** Run the relevant tests before and after changes.

---

## Dev responsibilities

- Keep the system runnable: fix broken runs and tests in the areas you touch.
- Respect layers: no core → UI/API dependencies; no product business logic in engine-core.
- Document only when it helps: new products, new run steps, or changed boundaries—not every code change.

---

## Dev boundaries

- **Don’t** move or rename core folders (engine-core, engine-*, engine-api, product-ui) without alignment.
- **Don’t** duplicate technical docs (dependency graphs, CI/CD, infra) in these guides; point to `docs/engineering/`, `ARCHITECTURE_MAP.md`, `DEPENDENCY_GRAPH.md`, `infra/` instead.
- **Do** use START_HERE, DEV_GUIDE, PRODUCT_GUIDE, ARCH_OVERVIEW for onboarding and mental model; use other docs for deep technical reference.

You’re set to run the system, run tests, and add features within the platform’s boundaries. For the big picture, see [START_HERE.md](../onboarding/START_HERE.md) and [ARCH_OVERVIEW.md](../architecture/ARCH_OVERVIEW.md).
