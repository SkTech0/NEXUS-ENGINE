# Nexus Engine

Nx monorepo + microservices: engine-core, distributed, data, intelligence, optimization, AI, trust, API, product-ui, saas-layer.

## Structure (at a glance)

| Area | Folder | What’s inside |
|------|--------|----------------|
| **Code** | `apps/` | product-ui, engine-api |
| | `engines/` | engine-core, engine-ai, engine-data, intelligence, optimization, trust, distributed, saas-layer, layers |
| | `platform-runtime/` | service-shells, gateway, orchestration, runtime-decoupling |
| **Deploy** | `deploy/` | Docker, Compose, K8s |
| **Docs** | `docs/` | All docs — [docs/README.md](docs/README.md) is the index |
| **Specs** | `specs/` | Contracts, governance, products, quality, release, ops — [specs/README.md](specs/README.md) |
| **Infra** | `infra/` | Observability, CI/CD |

Full map: [STRUCTURE.md](STRUCTURE.md).

## Tech

- **Nx** — Workspace and build orchestration
- **Angular 18** — product-ui
- **.NET 10** — engine-api
- **Python 3.11+** — engine-ai
- **TypeScript** — Strict mode
- **ESLint + Prettier** — Lint and format

## Prerequisites

- Node.js 20+
- .NET 10 SDK
- Python 3.11+ (for engine-ai)
- Docker & Docker Compose (optional)

## Quick start

```bash
# Install dependencies
npm install

# Build all
npx nx run-many --target=build --all

# Serve product-ui
npx nx serve product-ui

# Run engine-api (.NET)
./run-api.sh
```

## Docker

```bash
docker-compose up -d
# engine-api: http://localhost:10021
# product-ui: http://localhost:10022
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run build` | Build all projects |
| `npm run lint` | Lint all |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |

## Docs

- **Start:** [docs/README.md](docs/README.md) — single index for all docs
- **First read:** [docs/onboarding/START_HERE.md](docs/onboarding/START_HERE.md) · [docs/onboarding/GETTING_STARTED.md](docs/onboarding/GETTING_STARTED.md)
- **Run & structure:** [docs/guides/PROJECT_STRUCTURE.md](docs/guides/PROJECT_STRUCTURE.md) · [docs/guides/RUN-E2E.md](docs/guides/RUN-E2E.md)
