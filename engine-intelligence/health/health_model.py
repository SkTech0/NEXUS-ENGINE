"""
Engine Intelligence — Health model (ERL-4).
Liveness, readiness, dependency checks.
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Callable

ENGINE_NAME = "engine-intelligence"
ENGINE_VERSION = "1.0.0"


@dataclass
class DependencyCheck:
    name: str
    status: str
    message: str | None = None
    latency_ms: float | None = None


@dataclass
class HealthResult:
    status: str
    engine_name: str
    engine_version: str
    checks: list[DependencyCheck] = field(default_factory=list)
    message: str | None = None
    timestamp: str = field(default_factory=lambda: time.strftime("%Y-%m-%dT%H:%M:%S.%fZ", time.gmtime()))


class HealthModel:
    def __init__(
        self,
        engine_name: str = ENGINE_NAME,
        engine_version: str = ENGINE_VERSION,
        dependency_checks: list[Callable[[], Any]] | None = None,
    ) -> None:
        self.engine_name = engine_name
        self.engine_version = engine_version
        self._dependency_checks = list(dependency_checks or [])

    def add_dependency_check(self, fn: Callable[[], Any]) -> None:
        self._dependency_checks.append(fn)

    def check_dependencies(self) -> list[DependencyCheck]:
        results: list[DependencyCheck] = []
        for fn in self._dependency_checks:
            name = getattr(fn, "__name__", "unknown")
            start = time.perf_counter()
            try:
                fn()
                results.append(
                    DependencyCheck(name=name, status="healthy", latency_ms=(time.perf_counter() - start) * 1000)
                )
            except Exception as e:  # noqa: BLE001
                results.append(
                    DependencyCheck(
                        name=name,
                        status="unhealthy",
                        message=str(e),
                        latency_ms=(time.perf_counter() - start) * 1000,
                    )
                )
        return results

    def liveness(self) -> HealthResult:
        return HealthResult(status="healthy", engine_name=self.engine_name, engine_version=self.engine_version)

    def readiness(self) -> HealthResult:
        checks = self.check_dependencies()
        status = "healthy"
        if any(c.status == "unhealthy" for c in checks):
            status = "unhealthy"
        elif any(c.status == "degraded" for c in checks):
            status = "degraded"
        return HealthResult(
            status=status,
            engine_name=self.engine_name,
            engine_version=self.engine_version,
            checks=checks,
        )
