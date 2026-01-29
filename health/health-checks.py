#!/usr/bin/env python3
"""
Nexus Engine — health checks.
Liveness, readiness, startup probes. Run as script or import.
"""
from __future__ import annotations

import os
import sys
import urllib.request
import urllib.error
from dataclasses import dataclass, field
from typing import Callable


@dataclass
class CheckResult:
    name: str
    ok: bool
    message: str = ""
    latency_ms: float = 0.0


def _elapsed(fn: Callable[[], None]) -> tuple[None, float]:
    import time
    start = time.perf_counter()
    fn()
    return None, (time.perf_counter() - start) * 1000


def check_engine_api(base_url: str) -> CheckResult:
    """HTTP GET /api/Health."""
    url = f"{base_url.rstrip('/')}/api/Health"
    try:
        import time
        t0 = time.perf_counter()
        with urllib.request.urlopen(url, timeout=5) as r:
            code = r.getcode()
        elapsed = (time.perf_counter() - t0) * 1000
        return CheckResult("engine-api", code == 200, f"HTTP {code}", latency_ms=elapsed)
    except urllib.error.URLError as e:
        return CheckResult("engine-api", False, str(e.reason))
    except Exception as e:
        return CheckResult("engine-api", False, str(e))


def check_engine_api_readiness(base_url: str) -> CheckResult:
    """Readiness: Engine + Health both OK."""
    h = check_engine_api(base_url)
    if not h.ok:
        return h
    url = f"{base_url.rstrip('/')}/api/Engine"
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            ok = r.getcode() == 200
        return CheckResult("engine-api-readiness", ok, "OK" if ok else "Engine check failed")
    except Exception as e:
        return CheckResult("engine-api-readiness", False, str(e))


def check_dependency(base_url: str) -> CheckResult:
    """Dependency check (engine-api as dependency)."""
    return check_engine_api(base_url)


def run_liveness(base_url: str) -> bool:
    """Liveness probe: API health."""
    r = check_engine_api(base_url)
    return r.ok


def run_readiness(base_url: str) -> bool:
    """Readiness probe: API + Engine."""
    return check_engine_api_readiness(base_url).ok


def run_startup(base_url: str) -> bool:
    """Startup probe: same as liveness for now."""
    return run_liveness(base_url)


def main() -> None:
    base = os.environ.get("ENGINE_API_URL", "http://localhost:5000")
    mode = os.environ.get("HEALTH_MODE", "all")
    if mode == "liveness":
        sys.exit(0 if run_liveness(base) else 1)
    if mode == "readiness":
        sys.exit(0 if run_readiness(base) else 1)
    if mode == "startup":
        sys.exit(0 if run_startup(base) else 1)
    # default: all
    results = [
        check_engine_api(base),
        check_engine_api_readiness(base),
    ]
    for r in results:
        print(f"  {r.name}: {'OK' if r.ok else 'FAIL'} — {r.message}")
    sys.exit(0 if all(r.ok for r in results) else 1)


if __name__ == "__main__":
    main()
