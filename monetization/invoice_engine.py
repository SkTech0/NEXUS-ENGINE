"""
Invoice engine — generate and store invoices.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class InvoiceLine:
    """A line item: description, quantity, unit_price_cents, amount_cents."""

    description: str
    quantity: float = 1.0
    unit_price_cents: int = 0
    amount_cents: int = 0


@dataclass
class Invoice:
    """An invoice: id, tenant_id, total_cents, lines, status."""

    id: str
    tenant_id: str
    total_cents: int
    lines: list[InvoiceLine] = field(default_factory=list)
    status: str = "draft"
    metadata: dict[str, Any] = field(default_factory=dict)


class InvoiceEngine:
    """
    Invoice engine: create, get, list; optional number generator.
    Testable.
    """

    def __init__(self) -> None:
        self._invoices: dict[str, Invoice] = {}
        self._counter = 0

    def create(
        self,
        tenant_id: str,
        lines: list[InvoiceLine],
        invoice_id: str | None = None,
    ) -> Invoice:
        """Create invoice; total from lines. Testable."""
        total = sum(l.amount_cents or int(l.quantity * l.unit_price_cents) for l in lines)
        iid = invoice_id or f"inv_{self._counter}"
        self._counter += 1
        inv = Invoice(id=iid, tenant_id=tenant_id, total_cents=total, lines=lines)
        self._invoices[iid] = inv
        return inv

    def get(self, invoice_id: str) -> Invoice | None:
        """Get invoice by id. Testable."""
        return self._invoices.get(invoice_id)

    def list_for_tenant(self, tenant_id: str) -> list[Invoice]:
        """List invoices for tenant. Testable."""
        return [i for i in self._invoices.values() if i.tenant_id == tenant_id]

    def set_status(self, invoice_id: str, status: str) -> bool:
        """Set invoice status. Testable."""
        inv = self._invoices.get(invoice_id)
        if inv is None:
            return False
        inv.status = status
        return True


def create_invoice_engine() -> InvoiceEngine:
    """Create invoice engine. Testable."""
    return InvoiceEngine()
