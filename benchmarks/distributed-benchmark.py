#!/usr/bin/env python3
"""Nexus Engine — distributed (message bus, state) benchmark."""
from __future__ import annotations

import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
for d in ["engine-distributed"]:
    sys.path.insert(0, str(ROOT / d))

def run():
    from messaging.message_bus import create_message_bus
    from state.distributed_state import create_distributed_state

    n = 2000
    bus = create_message_bus()
    count = [0]
    def h(m):
        count[0] += 1
    bus.subscribe("bench", h)
    t0 = time.perf_counter()
    for i in range(n):
        bus.publish("bench", i)
    elapsed = time.perf_counter() - t0
    print(f"message_bus pub/sub {n} msgs: {elapsed:.3f}s (received {count[0]})")

    state = create_distributed_state()
    t0 = time.perf_counter()
    for i in range(n):
        state.set(f"k{i}", i)
    for i in range(n):
        state.get(f"k{i}")
    elapsed = time.perf_counter() - t0
    print(f"distributed_state {n} set+get: {elapsed:.3f}s")

if __name__ == "__main__":
    run()
