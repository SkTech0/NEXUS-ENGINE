# Nexus Engine

Nx monorepo + microservices: engine-core, distributed, data, intelligence, optimization, AI, trust, API, product-ui, saas-layer.

## Structure

```
/engine-core       — Domain kernel, entities, ports (TypeScript)
/engine-distributed — Coordination and distribution (TypeScript)
/engine-data       — Persistence and data access (TypeScript)
/engine-intelligence — Decision and reasoning (TypeScript)
/engine-optimization — Scheduling and optimization (TypeScript)
/engine-ai         — AI/ML engines (Python)
/engine-trust      — Security, identity, audit (TypeScript)
/engine-api        — .NET 10 HTTP API
/product-ui        — Angular 18 SPA
/saas-layer        — Multi-tenant and SaaS (TypeScript)
/infra             — Deployment and infrastructure
/docs              — Documentation
```

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
cd engine-api && dotnet run --project src/EngineApi/EngineApi.csproj
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

See [docs/architecture.md](docs/architecture.md) and [docs/ddd.md](docs/ddd.md).
