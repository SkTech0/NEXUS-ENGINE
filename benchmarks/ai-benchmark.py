#!/usr/bin/env python3
"""Nexus Engine — AI inference benchmark."""
from __future__ import annotations

import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "engine-ai"))

def run():
    from inference.inference_service import create_inference_service, InferenceRequest

    svc = create_inference_service()
    svc.set_model_loader(lambda _: "mock")
    svc.set_predict_fn(lambda m, i: {"out": sum(i.values()) if i else 0})
    n = 1000
    t0 = time.perf_counter()
    for i in range(n):
        req = InferenceRequest("default", {"x": i})
        svc.infer(req)
    elapsed = time.perf_counter() - t0
    print(f"ai inference {n} runs: {elapsed:.3f}s ({elapsed/n*1000:.2f}ms/run)")

if __name__ == "__main__":
    run()
