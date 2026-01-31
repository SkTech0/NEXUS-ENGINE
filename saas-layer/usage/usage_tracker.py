"""
Usage tracker — track usage per tenant/metric; report and limits.
Modular, testable. Optional timestamp for usage windows and billing.
"""
import time
from dataclasses import dataclass, field
from typing import Any


@dataclass
class UsageRecord:
    """A usage record: tenant_id, metric, value, optional timestamp."""

    tenant_id: str
    metric: str
    value: float
    unit: str = "count"
    timestamp: float = field(default_factory=time.time)


@dataclass
class UsageSummary:
    """Aggregate usage for a tenant/metric."""

    tenant_id: str
    metric: str
    total: float
    unit: str = "count"


class UsageTracker:
    """
    Usage tracking: record, get total, get by tenant; optional limit check.
    Testable.
    """

    def __init__(self) -> None:
        self._records: list[UsageRecord] = []
        self._limits: dict[tuple[str, str], float] = {}

    def record(
        self,
        tenant_id: str,
        metric: str,
        value: float,
        unit: str = "count",
        timestamp: float | None = None,
    ) -> UsageRecord:
        """Record usage. Optional timestamp for backfill; default is now. Testable."""
        ts = timestamp if timestamp is not None else time.time()
        rec = UsageRecord(tenant_id=tenant_id, metric=metric, value=value, unit=unit, timestamp=ts)
        self._records.append(rec)
        return rec

    def get_total(self, tenant_id: str, metric: str) -> float:
        """Total value for tenant/metric. Testable."""
        return sum(
            r.value for r in self._records
            if r.tenant_id == tenant_id and r.metric == metric
        )

    def get_summary(self, tenant_id: str) -> list[UsageSummary]:
        """Summaries per metric for tenant. Testable."""
        metrics: dict[str, float] = {}
        for r in self._records:
            if r.tenant_id != tenant_id:
                continue
            metrics[r.metric] = metrics.get(r.metric, 0) + r.value
        return [
            UsageSummary(tenant_id=tenant_id, metric=m, total=v)
            for m, v in metrics.items()
        ]

    def set_limit(self, tenant_id: str, metric: str, limit: float) -> None:
        """Set usage limit for tenant/metric. Testable."""
        self._limits[(tenant_id, metric)] = limit

    def is_over_limit(self, tenant_id: str, metric: str) -> bool:
        """Check if tenant is over limit for metric. Testable."""
        limit = self._limits.get((tenant_id, metric))
        if limit is None:
            return False
        return self.get_total(tenant_id, metric) > limit


def create_usage_tracker() -> UsageTracker:
    """Create usage tracker. Testable."""
    return UsageTracker()
