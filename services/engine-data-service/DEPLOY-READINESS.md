# Engine-Data-Service Deploy Readiness

## Verified (ready to deploy)

| Check | Status |
|-------|--------|
| **Docker path fix** | In Docker (`/app/app/domain_facade.py`) there are only 3 parents; code uses `parents[3]` only when `len(parents) > 3`, so no `IndexError` at import. |
| **Startup without engine-data** | When engine-data is not on path, `init_engine()` fails with `ImportError`; lifecycle catches it and logs; app starts; health responds. |
| **Health endpoints** | `GET /health` and `GET /api/Data/health` return `{"status": "healthy", "service": "engine-data-service"}`. |
| **PORT at runtime** | Infra Dockerfile uses `CMD ["sh", "-c", "exec uvicorn ... --port ${PORT:-5015}"]` so Railway/cloud can assign port. |
| **Index/query when engine unavailable** | When engine not initialized, index/query return structured `ENGINE_UNAVAILABLE` response (no crash). |

## Deploy checklist

- [ ] Use Dockerfile that listens on `$PORT` (infra Dockerfile or `deploy/railway/engine-data/Dockerfile`).
- [ ] Build context: if using `deploy/railway/engine-data/Dockerfile`, set context to repo root so `COPY services/engine-data-service/` works.
- [ ] Healthcheck path: `/api/Data/health` (or `/health`).
- [ ] Optional: add engine-data to image (e.g. multi-stage or copy engine-data into image) for full index/query; otherwise health works and index/query return ENGINE_UNAVAILABLE.

## Local test (optional)

With deps installed (`pip install -r requirements.txt`):

```bash
cd services/engine-data-service
PORT=5015 python run.py
# In another terminal:
curl http://127.0.0.1:5015/health
curl http://127.0.0.1:5015/api/Data/health
```

With engine-data on path (full behavior):

```bash
PYTHONPATH=../../engine-data:. PORT=5015 python run.py
# Then POST /api/Data/index and /api/Data/query for real indexing/query.
```
