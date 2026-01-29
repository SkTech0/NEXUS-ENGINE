# Running NEXUS-ENGINE End-to-End

How to run the full project: dependencies, commands, and options for single vs multiple machines.

---

## Dependencies (what you need installed)

| Dependency | Version | Used for |
|------------|--------|----------|
| **Node.js** | 20+ | Nx, Angular, product-ui, runtime-decoupling runners |
| **npm** | (comes with Node) | Install JS/TS deps, run Nx |
| **.NET SDK** | 10 | engine-api (C# Web API) |
| **Python** | 3.11+ | engine-ai, engine-data, engine-intelligence, engine-optimization, engine-trust, engine-distributed (tests/benchmarks) |
| **Docker + Docker Compose** | (optional) | Run API + UI in containers |

### Quick check

```bash
node -v    # v20.x or higher
npm -v
dotnet --version   # 10.x
python3 --version  # 3.11+
# Optional:
docker -v
docker compose version
```

---

## Option A: Single machine, minimal (API + UI)

**What runs:** One process for engine-api, one for product-ui. The API hosts all engine logic in-process; no separate engine processes.

### 1. Install dependencies

From repo root:

```bash
npm install
cd apps/engine-api && dotnet restore && cd ../..
```

### 2. Start the API (terminal 1)

```bash
./run-api.sh
# or: cd apps/engine-api && dotnet run --project src/EngineApi/EngineApi.csproj
```

- API: http://localhost:5000 (HTTP), https://localhost:5001 (HTTPS)
- Swagger: http://localhost:5000/swagger
- Health: http://localhost:5000/api/Health

Leave this running.

### 3. Start the UI (terminal 2)

From repo root:

```bash
npx nx serve product-ui
```

- UI: http://localhost:4200  
- UI proxies `/api` to http://localhost:5000 (see `apps/product-ui/proxy.conf.json`).

### 4. Use the app

- Open http://localhost:4200 in a browser.
- Use landing, playground, loan demo (apply → evaluate → decision). All calls go to engine-api.

### 5. Smoke test (optional, API must be up)

```bash
./scripts/test-engine-flow.sh http://localhost:5000
./run-engine.sh http://localhost:5000
```

---

## Option B: Single machine, full test suite

**What runs:** Same as Option A (API + UI for “running the app”), plus any tests/benchmarks you choose.

### 1. Same as Option A (install, start API, start UI)

### 2. Run all tests

```bash
# Nx (UI, etc.)
npx nx run-many --target=test --all

# .NET API
cd apps/engine-api && dotnet test && cd ../..

# Python engines (optional; needs pytest)
pip install -r requirements-test.txt
# Then per engine, e.g.:
cd engines/engine-ai && python3 -m pytest tests/ -v --tb=short && cd ../..
```

Or use the bundled script (API must be running for engine flow):

```bash
./run-tests.sh
# Skip parts if needed:
./run-tests.sh --skip-ui
./run-tests.sh --skip-api
./run-tests.sh --skip-engines
./run-tests.sh --skip-flow
```

### 3. Full suite (lint, build, test, engine flow, optional benchmarks)

```bash
# Start API in another terminal first, then:
./run-all.sh http://localhost:5000
```

---

## Option C: Single machine, decoupled (multiple processes)

**What runs:** Each engine can run as its own process (runtime-decoupling). You can run “API + UI” only, or add any of the standalone engine runners.

### 1. Build runtime-decoupling

```bash
npx nx build runtime-decoupling
```

### 2. Start engine-api (required for UI and classic flow)

Terminal 1:

```bash
./run-api.sh
# or: cd apps/engine-api && dotnet run --project src/EngineApi/EngineApi.csproj
```

Or via runtime-decoupling launcher (from repo root, after build):

```bash
node dist/platform-runtime/runtime-decoupling/runners/engine-api-runner.js
```

### 3. Start product-ui (required for browser E2E)

Terminal 2:

```bash
npx nx serve product-ui
```

### 4. Optional: run engines as separate processes

Each runs on its own port; engine-api would need to be configured to call these URLs instead of in-process logic (or you use them for direct/testing).

| Service | Command (from repo root) | Default URL |
|---------|--------------------------|-------------|
| engine-core | `npx nx run runtime-decoupling:serve-engine-core` or `node dist/runtime-decoupling/runners/engine-core-runner.js` | http://localhost:3001 |
| engine-ai | `npx nx run runtime-decoupling:serve-engine-ai` | http://localhost:3002 |
| engine-data | `npx nx run runtime-decoupling:serve-engine-data` | http://localhost:3003 |
| engine-intelligence | `npx nx run runtime-decoupling:serve-engine-intelligence` | http://localhost:3004 |
| engine-optimization | `npx nx run runtime-decoupling:serve-engine-optimization` | http://localhost:3005 |
| engine-trust | `npx nx run runtime-decoupling:serve-engine-trust` | http://localhost:3006 |

Example (one extra terminal):

```bash
node dist/runtime-decoupling/runners/engine-core-runner.js
# Health: curl http://localhost:3001/health
```

---

## Option D: Docker (API + UI only)

**What runs:** engine-api and product-ui in containers. No Python engines in this compose file.

### 1. From repo root

```bash
docker compose up -d
```

- engine-api: http://localhost:10021  
- product-ui: http://localhost:10022  

### 2. Point UI at API

product-ui in Docker is built with its own config; the compose setup is intended to have the UI call the API (e.g. on port 10021). If you need a different API base URL, rebuild with the right env or override.

### 3. Rebuild after code changes

```bash
docker compose up -d --build engine-api
docker compose up -d --build product-ui
```

---

## Different machines (what runs where)

You can split services across machines as long as URLs and ports are correct.

| Machine | Typical role | What to run | Dependencies |
|--------|--------------|-------------|--------------|
| **Machine 1** | API server | engine-api (`dotnet run ...`) | .NET 10 SDK |
| **Machine 2** | Frontend / dev | product-ui (`npx nx serve product-ui`) | Node 20+, npm (repo with `npm install`) |
| **Machine 3** (optional) | Engine host | runtime-decoupling runners (e.g. engine-core, engine-ai) | Node 20+, npm; Python 3.11+ if using engine-ai Python path |

### Configuration across machines

- **UI → API:** Set `product-ui/src/environments/environment.ts` `apiUrl` to the API base URL (e.g. `http://<api-host>:5000/api`). If using the dev proxy, set `proxy.conf.json` target to that URL and ensure the UI is served with the proxy (e.g. `npx nx serve product-ui`).
- **API → engines:** If engines run on other hosts, configure engine-api (or the runtime-decoupling gateways) with the correct base URLs (e.g. env vars or config) so the API calls the right machine.

### Example: API on one host, UI on your laptop

- **Host A (e.g. cloud VM):** Install .NET 10, clone repo, run `dotnet run --project apps/engine-api/src/EngineApi/EngineApi.csproj` (and expose port 5000).
- **Your laptop:** Clone repo, `npm install`, set UI `apiUrl` (or proxy target) to `http://<Host-A-IP>:5000/api`, run `npx nx serve product-ui`, open http://localhost:4200.

---

## Commands summary

| Goal | Command (from repo root) |
|------|---------------------------|
| Install JS/TS deps | `npm install` |
| Install .NET deps | `cd apps/engine-api && dotnet restore && cd ../..` |
| Install Python test deps | `pip install -r requirements-test.txt` |
| Start API | `./run-api.sh` or `cd apps/engine-api && dotnet run --project src/EngineApi/EngineApi.csproj` |
| Start UI | `npx nx serve product-ui` |
| Build runtime-decoupling | `npx nx build runtime-decoupling` |
| Run one decoupled engine | `node dist/platform-runtime/runtime-decoupling/runners/engine-core-runner.js` (or serve-engine-ai, etc.) |
| Engine flow smoke test | `./scripts/test-engine-flow.sh http://localhost:5000` |
| API smoke test | `./scripts/test-api.sh http://localhost:5000` |
| Full test script | `./run-tests.sh` (optionally with `--skip-ui`, `--skip-api`, `--skip-engines`, `--skip-flow`) |
| Lint + build + test + flow | `./run-all.sh http://localhost:5000` (API must be up) |
| Run with Docker | `docker compose up -d` |

---

## Minimal path to “see it work” end-to-end

1. Install: Node 20+, .NET 10, then `npm install` and `cd apps/engine-api && dotnet restore && cd ../..`.
2. Terminal 1: `./run-api.sh` or `cd apps/engine-api && dotnet run --project src/EngineApi/EngineApi.csproj`.
3. Terminal 2: `npx nx serve product-ui`.
4. Browser: http://localhost:4200 → use the app (e.g. loan flow).
5. Optional: `./scripts/test-engine-flow.sh http://localhost:5000`.

That’s the minimum for a full end-to-end run on one machine.
