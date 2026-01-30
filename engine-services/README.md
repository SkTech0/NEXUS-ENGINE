# Engine Services

HTTP API that wraps the real engines (engine-ai, engine-optimization, engine-intelligence, engine-trust). engine-api calls this service when `Engines:BaseUrl` is set.

**Run (from repo root):**

```bash
./run-engine-services.sh
```

Listens on port 5001. To use with engine-api:

1. Start engine-services: `./run-engine-services.sh`
2. Start engine-api with base URL set: `Engines__BaseUrl=http://localhost:5001 ./run-api.sh` or `./run-api-with-engines.sh`
3. Start product-ui: `npx nx serve product-ui`

Then use the loan flow in the UI; engine-api will call engine-services for Engine, AI, Optimization, Intelligence, and Trust instead of in-process stubs.
