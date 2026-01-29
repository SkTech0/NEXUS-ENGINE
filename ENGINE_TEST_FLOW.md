# Engine Test Flow

End-to-end flow for testing the Nexus Engine pipeline: **Data → Intelligence → Optimization → AI → API → UI**.

---

## Flow Overview

```
Data Engine → Intelligence Engine → Optimization Engine → AI Engine → API Engine → UI
```

| Step | Engine | Role |
|------|--------|------|
| 1 | **engine-data** | Push data (persistence, pipelines, indexing, caching) |
| 2 | **engine-intelligence** | Intelligence reasons (inference, decision, planning) |
| 3 | **engine-optimization** | Optimization optimizes (heuristics, solvers, schedulers) |
| 4 | **engine-ai** | AI processes (inference, models, features) |
| 5 | **engine-api** | API exposes (gateway, controllers, services) |
| 6 | **product-ui** | UI visualizes (dashboard, components, services) |
| 7 | **saas-layer** | Multi-tenant, auth, subscriptions, usage |
| 8 | **monetization** | Pricing, billing, payments, revenue |

---

## Example Test Scenario

1. **Push data** — engine-data ingests/stores data (pipelines, storage, indexing).
2. **AI processes** — engine-ai runs inference/features on the data.
3. **Intelligence reasons** — engine-intelligence evaluates context and produces decisions.
4. **Optimization optimizes** — engine-optimization runs solvers/schedulers on objectives.
5. **API exposes** — engine-api serves results via REST (Engine, Intelligence, Optimization, AI, Trust).
6. **UI visualizes** — product-ui fetches from API and renders dashboard, monitors, viewers.

---

## Engine Order (Canonical)

1. **engine-data**
2. **engine-intelligence**
3. **engine-optimization**
4. **engine-ai**
5. **engine-api**
6. **product-ui**
7. **saas-layer**
8. **monetization**

---

## Running the Test Flow

### Prerequisites

- **engine-api** running: `cd engine-api && dotnet run --project src/EngineApi/EngineApi.csproj`
- **product-ui** (optional for full flow): `npx nx serve product-ui`

### Quick API Test

From repo root:

```bash
./scripts/test-engine-flow.sh
```

Or manually:

```bash
# 1) Health
curl -s http://localhost:5000/api/Health

# 2) Engine status (gateway)
curl -s http://localhost:5000/api/Engine

# 3) Push / execute (data flow entry)
curl -s -X POST http://localhost:5000/api/Engine/execute \
  -H "Content-Type: application/json" \
  -d '{"action":"push","parameters":{"source":"test"}}'

# 4) Intelligence evaluate
curl -s -X POST http://localhost:5000/api/Intelligence/evaluate \
  -H "Content-Type: application/json" \
  -d '{"context":"test","inputs":{"key":"value"}}'

# 5) Optimization optimize
curl -s -X POST http://localhost:5000/api/Optimization/optimize \
  -H "Content-Type: application/json" \
  -d '{"targetId":"t1","objective":"minimize","constraints":{}}'

# 6) AI infer
curl -s -X POST http://localhost:5000/api/AI/infer \
  -H "Content-Type: application/json" \
  -d '{"modelId":"default","inputs":{"x":1}}'

# 7) UI: open http://localhost:4200 and use dashboard / engine monitor
```

### Swagger

- **engine-api Swagger:** http://localhost:5000/swagger (or https://localhost:5001/swagger)

---

## References

- **ARCHITECTURE_MAP.md** — Engine relationships and data flow
- **engine-api/README.md** — API structure and run instructions
- **engine-api/test-api.sh** — Basic API health/engine checks
