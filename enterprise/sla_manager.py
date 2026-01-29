"""
SLA manager — define and check service-level agreements.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class SLATarget:
    """SLA target: metric, threshold, unit."""

    metric: str
    threshold: float
    unit: str = "percent"


@dataclass
class SLA:
    """SLA: id, tenant_id, targets, metadata."""

    id: str
    tenant_id: str
    targets: list[SLATarget] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class SLAStatus:
    """SLA status: sla_id, met flag, breaches per target."""

    sla_id: str
    met: bool = True
    breaches: list[dict[str, Any]] = field(default_factory=list)


class SLAManager:
    """
    SLA manager: create, get, list; check(sla_id, current_metrics) returns status.
    Testable.
    """

    def __init__(self) -> None:
        self._slas: dict[str, SLA] = {}

    def create(self, sla: SLA) -> None:
        """Create SLA. Testable."""
        self._slas[sla.id] = sla

    def get(self, sla_id: str) -> SLA | None:
        """Get SLA by id. Testable."""
        return self._slas.get(sla_id)

    def list_for_tenant(self, tenant_id: str) -> list[SLA]:
        """List SLAs for tenant. Testable."""
        return [s for s in self._slas.values() if s.tenant_id == tenant_id]

    def check(self, sla_id: str, current_metrics: dict[str, float]) -> SLAStatus | None:
        """
        Check SLA against current metrics. Metric must meet threshold (e.g. availability >= 99).
        Returns SLAStatus with breaches. Testable.
        """
        sla = self._slas.get(sla_id)
        if sla is None:
            return None
        status = SLAStatus(sla_id=sla_id)
        for target in sla.targets:
            value = current_metrics.get(target.metric)
            if value is None:
                status.breaches.append({"metric": target.metric, "reason": "missing"})
                status.met = False
            elif value < target.threshold:
                status.breaches.append({
                    "metric": target.metric,
                    "value": value,
                    "threshold": target.threshold,
                })
                status.met = False
        return status


def create_sla_manager() -> SLAManager:
    """Create SLA manager. Testable."""
    return SLAManager()
