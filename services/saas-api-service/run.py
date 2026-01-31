#!/usr/bin/env python3
"""Run SaaS API service. Use from repo root or from services/saas-api-service with PYTHONPATH including saas-layer."""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=False)
