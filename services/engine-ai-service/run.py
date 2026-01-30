#!/usr/bin/env python3
"""
Local runner for engine-ai-service.
"""
import uvicorn
from app.config import load_config

if __name__ == "__main__":
    cfg = load_config()
    uvicorn.run("app.main:app", host=cfg.host, port=cfg.port, reload=False)
