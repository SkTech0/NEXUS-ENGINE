# Nexus Engine — Revenue Model

Revenue streams, pricing levers, and monetization mechanics.

---

## 1. Revenue Streams

### 1.1 Subscription (recurring)

- **Source**: saas-layer (subscription_service), monetization (billing_engine).
- **Mechanics**: Plan-based (e.g. Starter, Pro, Enterprise); per tenant or per seat; monthly/annual.
- **Levers**: Tier limits (tenants, users, API calls); feature flags (license_manager); support level.

### 1.2 Usage-based

- **Source**: usage_tracker, pricing_engine, billing_engine, revenue_tracker.
- **Mechanics**: Overage above plan; metered API calls, compute, or storage; events/records processed.
- **Levers**: Unit price, tiers, and caps; free tier or included usage per plan.

### 1.3 Marketplace / platform

- **Source**: marketplace_engine, plugin_engine, api_registry.
- **Mechanics**: Revenue share on paid offerings; listing or transaction fees; premium integrations.
- **Levers**: Share %; minimum fee; featured placement.

### 1.4 Enterprise and professional services

- **Source**: enterprise (compliance_engine, governance_engine, sla_manager, policy_engine); contracts.
- **Mechanics**: Enterprise tier; compliance/SLA add-ons; implementation and support packages.
- **Levers**: Contract value, duration, and payment terms.

---

## 2. Pricing Constructs

| Construct | Example | Used for |
|-----------|--------|----------|
| **Per tenant** | $X / tenant / month | Multi-tenant SaaS |
| **Per seat** | $Y / user / month | Collaboration, admin seats |
| **Per unit of usage** | $Z / 1M API calls | Usage-based |
| **Tier + overage** | Base + $/unit above limit | Hybrid |
| **Revenue share** | % of GMV or fee | Marketplace |
| **Fixed contract** | Annual enterprise fee | Enterprise, SLA |

---

## 3. Alignment with Product

- **Engine API**: Billing hooks and usage_tracker for API calls and feature usage; pricing_engine for tiered/usage pricing.
- **Product UI**: Seat-based or tenant-based plans; usage visible in dashboard.
- **SaaS layer**: Tenant_manager, subscription_service, usage_tracker feed billing_engine and invoice_engine.
- **Monetization**: pricing_engine (compute), billing_engine (events), payment_gateway (charge), invoice_engine (invoices), revenue_tracker (aggregation).
- **Enterprise**: Compliance and SLA packages as add-ons; policy_engine for feature/entitlement checks.

---

## 4. Revenue Waterfall (conceptual)

1. **Gross revenue**: Subscription + usage + marketplace + other.
2. **Less**: Refunds, revenue share (marketplace), payment processing.
3. **Net revenue**: Recognized per ASC 606 / local GAAP (subscription amortization, usage in period).
4. **Retention**: NRR from expansion and churn; cohort retention by segment.

---

## 5. Metrics to Track

- **MRR / ARR**: By stream (subscription vs usage vs other).
- **ARPU**: Per tenant or per customer.
- **Usage mix**: % revenue from usage-based vs fixed subscription.
- **Marketplace**: GMV, take rate, and net marketplace revenue.
- **Enterprise**: Contract size, duration, and attach rate (compliance, SLA).

---

## 6. References

- Business model: `docs/startup/business_model.md`
- Go-to-market: `docs/startup/go_to_market.md`
- Valuation: `docs/investor/valuation_model.md`
