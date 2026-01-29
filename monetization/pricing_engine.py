"""
Pricing engine — compute price from plan, usage, and rules.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class PriceTier:
    """A price tier: min_quantity, max_quantity, unit_price_cents."""

    min_quantity: float
    max_quantity: float
    unit_price_cents: int


@dataclass
class PricingRule:
    """A rule: plan_id, tiers or flat price."""

    plan_id: str
    flat_cents: int | None = None
    tiers: list[PriceTier] = field(default_factory=list)


@dataclass
class PriceResult:
    """Computed price: total_cents, breakdown."""

    total_cents: int
    breakdown: dict[str, Any] = field(default_factory=dict)


class PricingEngine:
    """
    Pricing: add rules; compute(plan_id, quantity) returns PriceResult.
    Testable.
    """

    def __init__(self) -> None:
        self._rules: dict[str, PricingRule] = {}
        self._custom_fn: Callable[[str, float], PriceResult] | None = None

    def add_rule(self, rule: PricingRule) -> None:
        """Register pricing rule for plan. Testable."""
        self._rules[rule.plan_id] = rule

    def set_custom_pricer(self, fn: Callable[[str, float], PriceResult]) -> None:
        """Set custom (plan_id, quantity) -> PriceResult. Testable."""
        self._custom_fn = fn

    def compute(self, plan_id: str, quantity: float = 1.0) -> PriceResult:
        """Compute price for plan and quantity. Testable."""
        if self._custom_fn is not None:
            return self._custom_fn(plan_id, quantity)
        rule = self._rules.get(plan_id)
        if rule is None:
            return PriceResult(total_cents=0, breakdown={"plan_id": plan_id})
        if rule.flat_cents is not None:
            return PriceResult(total_cents=rule.flat_cents, breakdown={"type": "flat"})
        total = 0
        for tier in rule.tiers:
            if tier.min_quantity <= quantity <= tier.max_quantity:
                total = int(quantity * tier.unit_price_cents)
                break
        return PriceResult(total_cents=total, breakdown={"type": "tiered", "quantity": quantity})


def create_pricing_engine() -> PricingEngine:
    """Create pricing engine. Testable."""
    return PricingEngine()
