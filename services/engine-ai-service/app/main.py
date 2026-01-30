"""
Service entrypoint for engine-ai-service.
Independent process: wraps engine-ai; exposes /api/AI/infer, /api/AI/train, /health.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import load_config
from .api import api, mount_health_root
from .lifecycle import run_startup, run_shutdown, on_startup, on_shutdown


@asynccontextmanager
async def lifespan(app: FastAPI):
    await run_startup()
    yield
    await run_shutdown()


app = FastAPI(title="NEXUS Engine AI Service", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(api)
mount_health_root(app)


def create_app() -> FastAPI:
    return app
