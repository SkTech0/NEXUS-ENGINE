#!/usr/bin/env python3
"""Nexus Engine — API benchmark (HTTP)."""
from __future__ import annotations

import os
import sys
import time
import urllib.request
import json

BASE = os.environ.get("ENGINE_API_URL", "http://localhost:5000")

def get(path: str) -> float:
    url = f"{BASE.rstrip('/')}{path}"
    t0 = time.perf_counter()
    with urllib.request.urlopen(url, timeout=10) as r:
        r.read()
    return (time.perf_counter() - t0) * 1000

def post(path: str, body: dict) -> float:
    url = f"{BASE.rstrip('/')}{path}"
    data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method="POST", headers={"Content-Type": "application/json"})
    t0 = time.perf_counter()
    with urllib.request.urlopen(req, timeout=10) as r:
        r.read()
    return (time.perf_counter() - t0) * 1000

def run():
    n = 50
    endpoints = [
        ("GET /api/Health", lambda: get("/api/Health")),
        ("GET /api/Engine", lambda: get("/api/Engine")),
        ("POST /api/Engine/execute", lambda: post("/api/Engine/execute", {"action": "bench", "parameters": {}})),
        ("POST /api/AI/infer", lambda: post("/api/AI/infer", {"modelId": "default", "inputs": {"x": 1}})),
    ]
    for name, fn in endpoints:
        times = []
        for _ in range(n):
            try:
                times.append(fn())
            except Exception as e:
                print(f"{name}: error {e}")
                break
        if times:
            avg = sum(times) / len(times)
            print(f"{name} {n} runs: avg {avg:.1f}ms")

if __name__ == "__main__":
    run()
