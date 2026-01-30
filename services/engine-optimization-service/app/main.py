"""Service entrypoint for engine-optimization-service."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import api, mount_health_root
from .lifecycle import run_startup, run_shutdown


@asynccontextmanager
async def lifespan(app: FastAPI):
    await run_startup()
    yield
    await run_shutdown()


app = FastAPI(title="NEXUS Engine Optimization Service", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(api)
mount_health_root(app)


def create_app() -> FastAPI:
    return app
