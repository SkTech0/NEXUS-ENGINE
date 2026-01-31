"""
Signal collector — gathers TrustSignal at request time.

Collects platform signals for confidence computation. Optionally probes
engine health URLs when TRUST_PROBE_URLS env is set (comma-separated).
Probes use short timeouts to remain fast. If not configured, returns
default signals (self healthy, no dependency data).
"""
import os
import urllib.request
from urllib.error import URLError

from .signals import TrustSignal

PROBE_TIMEOUT_PER_URL = 0.5  # max seconds per URL


def _probe_url(url: str) -> tuple[bool, bool]:
    """Probe URL; return (success, timed_out). No side effects."""
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=PROBE_TIMEOUT_PER_URL) as resp:
            return (200 <= resp.status < 300, False)
    except TimeoutError:
        return (False, True)
    except OSError as e:
        # socket.timeout is OSError subclasses in some Python versions
        timed_out = "timed out" in str(e).lower() or "timeout" in type(e).__name__.lower()
        return (False, timed_out)
    except (URLError, ValueError):
        return (False, False)


def collect() -> TrustSignal:
    """
    Collect trust signals.

    - self_healthy: True (we're running).
    - dependency_readiness: From probe results if TRUST_PROBE_URLS set.
    - engine_health: Per-URL result when probing.
    - latency_timeout_observed: True if any probe times out.
    """
    self_healthy = True
    engine_health: dict[str, bool] = {}
    timeout_observed = False

    urls_str = os.environ.get("TRUST_PROBE_URLS", "").strip()
    if urls_str:
        urls = [u.strip() for u in urls_str.split(",") if u.strip()]
        for i, url in enumerate(urls):
            ok, timed_out = _probe_url(url)
            engine_health[f"target_{i}"] = ok
            if timed_out:
                timeout_observed = True

        dep_readiness = all(engine_health.values()) and not timeout_observed
    else:
        dep_readiness = True  # No probes configured → assume OK

    return TrustSignal(
        self_healthy=self_healthy,
        dependency_readiness=dep_readiness,
        engine_health=engine_health,
        latency_timeout_observed=timeout_observed,
    )
