"""
Payment gateway — charge, refund, status (abstract; plug real provider).
Modular, testable.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Any, Callable


class PaymentStatus(Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"


@dataclass
class ChargeRequest:
    """Charge request: amount_cents, currency, idempotency_key, metadata."""

    amount_cents: int
    currency: str = "USD"
    idempotency_key: str | None = None
    metadata: dict[str, Any] | None = None


@dataclass
class ChargeResult:
    """Charge result: payment_id, status, error_message."""

    payment_id: str
    status: PaymentStatus
    error_message: str | None = None


class PaymentGateway:
    """
    Payment gateway: set charge/refund handlers; charge(), refund().
    Testable; plug Stripe/etc in production.
    """

    def __init__(self) -> None:
        self._charge_fn: Callable[[ChargeRequest], ChargeResult] | None = None
        self._refund_fn: Callable[[str], ChargeResult] | None = None
        self._payments: dict[str, ChargeResult] = {}

    def set_charge_handler(self, fn: Callable[[ChargeRequest], ChargeResult]) -> None:
        """Set (ChargeRequest) -> ChargeResult. Testable."""
        self._charge_fn = fn

    def set_refund_handler(self, fn: Callable[[str], ChargeResult]) -> None:
        """Set (payment_id) -> ChargeResult. Testable."""
        self._refund_fn = fn

    def charge(self, request: ChargeRequest) -> ChargeResult:
        """Charge; returns ChargeResult. Testable."""
        if self._charge_fn is not None:
            result = self._charge_fn(request)
            self._payments[result.payment_id] = result
            return result
        pid = f"pay_{id(request) & 0x7FFFFFFF}"
        result = ChargeResult(payment_id=pid, status=PaymentStatus.PENDING)
        self._payments[pid] = result
        return result

    def refund(self, payment_id: str) -> ChargeResult:
        """Refund by payment_id. Testable."""
        if self._refund_fn is not None:
            return self._refund_fn(payment_id)
        existing = self._payments.get(payment_id)
        if existing is None:
            return ChargeResult(
                payment_id=payment_id,
                status=PaymentStatus.FAILED,
                error_message="Payment not found",
            )
        return ChargeResult(payment_id=payment_id, status=PaymentStatus.REFUNDED)

    def get_status(self, payment_id: str) -> ChargeResult | None:
        """Get payment status. Testable."""
        return self._payments.get(payment_id)


def create_payment_gateway() -> PaymentGateway:
    """Create payment gateway. Testable."""
    return PaymentGateway()
