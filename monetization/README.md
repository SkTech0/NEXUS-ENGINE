# Monetization Engine (Phase 11 — Revenue core)

Pricing, billing, payments, invoices, and revenue tracking.

## Files

| File | Purpose |
|------|--------|
| **pricing_engine.py** | PricingEngine — rules, tiers, compute(plan_id, quantity) |
| **billing_engine.py** | BillingEngine — config, create_event, list_events |
| **payment_gateway.py** | PaymentGateway — charge, refund, pluggable handlers |
| **invoice_engine.py** | InvoiceEngine — create, get, list_for_tenant |
| **revenue_tracker.py** | RevenueTracker — record, get_total, get_summary |

## Integration with SaaS layer (billing hooks)

Wire subscription events to monetization using `saas-layer/billing/billing_hooks.py`:

- `create_on_subscribe_hook(billing_callback)` — call `billing_engine.create_event`, `revenue_tracker.record`, or `payment_gateway.charge` when a tenant subscribes.
- `create_on_cancel_hook(billing_callback)` — call billing/usage cleanup when a tenant cancels.

Example: set `subscription_service.set_billing_hook_subscribe(hook)` with a callback that creates a billing event and records revenue for the tenant/plan.

## Usage

From repo root with `PYTHONPATH=.`:

```bash
cd NEXUS-ENGINE
set PYTHONPATH=.
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
