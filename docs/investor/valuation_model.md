# Nexus Engine — Valuation Model

Framework for valuation and investor metrics.

---

## 1. Valuation Approach

### 1.1 Methods Considered

| Method | Use case | Inputs |
|--------|----------|--------|
| **Revenue multiple** | Recurring revenue (ARR/MRR) | ARR × sector multiple (e.g. 5–15× for SaaS) |
| **DCF** | Projected cash flows | Revenue ramp, margins, WACC, terminal value |
| **Comparable transactions** | M&A context | Deal multiples (EV/ARR, EV/EBITDA) |
| **Scorecard / risk-adjusted** | Early stage | Benchmark valuation × factors (team, market, traction, etc.) |

### 1.2 Stage-Appropriate Choice

- **Pre-revenue**: Scorecard or comparable early-stage rounds; optional DCF for illustration.
- **Post-revenue**: Revenue multiple (ARR) + DCF sanity check.
- **Growth**: ARR multiple + DCF; benchmark to public comps (e.g. platform / dev-tools SaaS).

---

## 2. Key Metrics

### 2.1 Revenue Metrics

- **MRR / ARR**: Recurring revenue from subscriptions (saas-layer, monetization).
- **Usage revenue**: From usage-based pricing (usage_tracker, pricing_engine).
- **Marketplace revenue**: Share of marketplace/plugin revenue (marketplace_engine).
- **Gross revenue**: Total before revenue share and refunds.

### 2.2 Unit Economics (target over time)

- **CAC**: Customer acquisition cost (sales + marketing / new customers).
- **LTV**: Lifetime value (ARPU × gross margin % / churn rate).
- **LTV:CAC**: Target > 3×; payback < 24 months.
- **Gross margin**: Target 70%+ (SaaS); platform/marketplace may differ.

### 2.3 Growth Metrics

- **MRR/ARR growth**: Month-over-month or year-over-year.
- **Net revenue retention**: Expansion minus churn (target > 100%).
- **Logo retention**: % of customers retained.
- **Pipeline**: Qualified pipeline and conversion (for sales-led motion).

---

## 3. Assumptions Template

### 3.1 Revenue Ramp (example)

| Year | Tenants | ARPU (annual) | ARR | Notes |
|------|---------|----------------|-----|--------|
| Y1   | [ ]     | [ ]            | [ ] | Launch, first vertical |
| Y2   | [ ]     | [ ]            | [ ] | Scale, enterprise |
| Y3   | [ ]     | [ ]            | [ ] | Platform, marketplace |

### 3.2 Costs and Margins

- **COGS**: Infra, support, payment processing (e.g. 20–30% of revenue).
- **Gross margin**: 70–80% target.
- **OpEx**: R&D, GTM, G&A as % of revenue (typical path to profitability).

### 3.3 Capital Efficiency

- **Burn multiple**: Net burn / net new ARR (lower is better).
- **Runway**: Cash / monthly burn.
- **Path to profitability**: Quarter or year when operating cash flow ≥ 0.

---

## 4. Valuation Ranges (illustrative)

- **Pre-seed / seed**: Scorecard vs benchmark ($1–5M typical); adjust for team, market, product stage.
- **Series A**: Often 5–15× forward ARR (sector-dependent); DCF for sanity check.
- **Series B+**: Forward ARR multiple + growth and retention; benchmark to public comps.

*Ranges are illustrative; actual valuation depends on market, traction, and terms.*

---

## 5. Sensitivity

- **Revenue growth**: ±20% impact on DCF and multiple.
- **Churn**: ±5 pp impact on LTV and NRR.
- **Multiple**: ±2× ARR multiple impact on valuation.

---

## 6. References

- Revenue and business model: `docs/startup/revenue_model.md`, `docs/startup/business_model.md`
- Risk: `docs/investor/risk_analysis.md`
- GTM: `docs/startup/go_to_market.md`
