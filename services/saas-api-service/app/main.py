"""SaaS API service — exposes saas-layer (tenants, usage) over HTTP."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import api

app = FastAPI(title="NEXUS SaaS API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(api)
