# Monetization Engine

Pricing, billing, payments, invoices, and revenue tracking.

## Files

| File | Purpose |
|------|--------|
| **pricing_engine.py** | PricingEngine — rules, tiers, compute(plan_id, quantity) |
| **billing_engine.py** | BillingEngine — config, create_event, list_events |
| **payment_gateway.py** | PaymentGateway — charge, refund, pluggable handlers |
| **invoice_engine.py** | InvoiceEngine — create, get, list_for_tenant |
| **revenue_tracker.py** | RevenueTracker — record, get_total, get_summary |

## Usage

From repo root with `PYTHONPATH=monetization`:

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=monetization
python -c "from monetization import create_pricing_engine; e = create_pricing_engine(); print(e.compute('basic', 10))"
```

Or import submodules:

```python
from monetization.pricing_engine import create_pricing_engine, PricingRule, PriceTier
from monetization.billing_engine import create_billing_engine, BillingCycle
from monetization.payment_gateway import create_payment_gateway, ChargeRequest
from monetization.invoice_engine import create_invoice_engine, InvoiceLine
from monetization.revenue_tracker import create_revenue_tracker
```
