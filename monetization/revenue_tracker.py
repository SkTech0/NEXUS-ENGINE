"""
Revenue tracker — track revenue by tenant, period, and source.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class RevenueRecord:
    """A revenue record: tenant_id, amount_cents, source, period."""

    tenant_id: str
    amount_cents: int
    source: str = "subscription"
    period: str = ""
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class RevenueSummary:
    """Aggregate revenue: total_cents, count, by_source."""

    total_cents: int
    count: int
    by_source: dict[str, int] = field(default_factory=dict)


class RevenueTracker:
    """
    Revenue tracking: record, get total, get by tenant/period.
    Testable.
    """

    def __init__(self) -> None:
        self._records: list[RevenueRecord] = []

    def record(
        self,
        tenant_id: str,
        amount_cents: int,
        source: str = "subscription",
        period: str = "",
    ) -> RevenueRecord:
        """Record revenue. Testable."""
        rec = RevenueRecord(
            tenant_id=tenant_id,
            amount_cents=amount_cents,
            source=source,
            period=period,
        )
        self._records.append(rec)
        return rec

    def get_total(self, tenant_id: str | None = None, period: str | None = None) -> int:
        """Total revenue; optional tenant/period filter. Testable."""
        total = 0
        for r in self._records:
            if tenant_id is not None and r.tenant_id != tenant_id:
                continue
            if period is not None and r.period != period:
                continue
            total += r.amount_cents
        return total

    def get_summary(
        self,
        tenant_id: str | None = None,
        period: str | None = None,
    ) -> RevenueSummary:
        """Summary: total, count, by_source. Testable."""
        filtered = [
            r for r in self._records
            if (tenant_id is None or r.tenant_id == tenant_id)
            and (period is None or r.period == period)
        ]
        total = sum(r.amount_cents for r in filtered)
        by_source: dict[str, int] = {}
        for r in filtered:
            by_source[r.source] = by_source.get(r.source, 0) + r.amount_cents
        return RevenueSummary(total_cents=total, count=len(filtered), by_source=by_source)


def create_revenue_tracker() -> RevenueTracker:
    """Create revenue tracker. Testable."""
    return RevenueTracker()
