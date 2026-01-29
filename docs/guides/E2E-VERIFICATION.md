# E2E Verification — Local Run

Summary of local run and end-to-end verification (UI → API → engines).

## What was run

1. **Engine API** (Terminal 1)  
   - `dotnet run --project apps/engine-api/src/EngineApi/EngineApi.csproj --urls "http://localhost:5000"`  
   - Listening: http://localhost:5000  
   - Health: http://localhost:5000/api/Health → `{"status":"healthy","service":"engine-api"}`  

2. **Engine test flow** (API → engines in-process)  
   - `./scripts/test-engine-flow.sh http://localhost:5000`  
   - All steps returned 200 and valid JSON:  
     - Health, Engine status, Engine/execute, Intelligence/evaluate, Optimization/optimize, AI/infer, Trust/health  

3. **Product UI** (Terminal 2)  
   - Root `angular.json` was given a `serve` target so the dev server runs from repo root and resolves `node_modules`.  
   - `npx ng serve product-ui --configuration=development`  
   - Listening: http://localhost:4200  
   - UI root: http://localhost:4200/ → 200  

## Verification results

| Check                    | Result |
|--------------------------|--------|
| API health (direct)      | 200 OK |
| Engine flow (Health → Engine → execute → Intelligence → Optimization → AI → Trust) | All 200, valid JSON |
| UI build & serve         | 200 OK at http://localhost:4200 |
| UI → API (proxy)          | Use proxy when needed: run from `apps/product-ui` with `--proxy-config proxy.conf.json` or ensure proxy is set in the serve that you use |

## Fix applied for UI

- **apps/product-ui/tsconfig.json**: `extends` updated from `../tsconfig.base.json` to `../../tsconfig.base.json` (correct after restructure).  
- **Root angular.json**: `serve` target added so `ng serve product-ui` runs from repo root and finds root `node_modules`.  

## How to run again

From repo root:

```bash
# Terminal 1 — API
./run-api.sh
# or: dotnet run --project apps/engine-api/src/EngineApi/EngineApi.csproj --urls "http://localhost:5000"

# Terminal 2 — UI (after API is up)
npx ng serve product-ui --configuration=development

# Optional — verify engine flow (API must be up)
./scripts/test-engine-flow.sh http://localhost:5000
```

Then open http://localhost:4200 and use the app (landing, playground, loan demo). API calls from the browser go to the API; if you use the UI dev server started from repo root, configure proxy so `/api` is forwarded to http://localhost:5000 (e.g. use the proxy config from `apps/product-ui/proxy.conf.json` in your serve command if needed).
