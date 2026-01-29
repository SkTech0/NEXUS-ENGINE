#!/usr/bin/env python3
"""Nexus Engine — engine (data → intelligence → optimization) benchmark."""
from __future__ import annotations

import sys
import time
from pathlib import Path

# Add engines to path
ROOT = Path(__file__).resolve().parent.parent
for name in ["engine-data", "engine-intelligence", "engine-optimization"]:
    p = ROOT / name
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

def run():
    from pipelines.data_pipeline import create_pipeline
    from decision.decision_engine import create_decision_engine, Option, DecisionContext
    from schedulers.scheduler import create_scheduler, Task

    n = 500
    t0 = time.perf_counter()
    pipe = create_pipeline("bench")
    for i in range(10):
        pipe.add_stage(f"s{i}", lambda x, j=i: x + j)
    for _ in range(n):
        pipe.run(0)
    elapsed = time.perf_counter() - t0
    print(f"engine pipeline {n} runs: {elapsed:.3f}s ({elapsed/n*1000:.2f}ms/run)")

    dec = create_decision_engine(lambda o, c: o.payload or 0)
    for i in range(50):
        dec.add_option(Option(f"o{i}", i))
    t0 = time.perf_counter()
    for _ in range(n):
        dec.decide(DecisionContext(inputs={}))
    elapsed = time.perf_counter() - t0
    print(f"engine decision {n} runs: {elapsed:.3f}s")

    sched = create_scheduler()
    for i in range(20):
        sched.add_task(Task(f"t{i}", 1.0, priority=i % 3))
    t0 = time.perf_counter()
    for _ in range(n):
        sched.schedule()
        sched.clear()
        for i in range(20):
            sched.add_task(Task(f"t{i}", 1.0, priority=i % 3))
    elapsed = time.perf_counter() - t0
    print(f"engine scheduler {n} runs: {elapsed:.3f}s")

if __name__ == "__main__":
    run()
