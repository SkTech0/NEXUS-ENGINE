# NEXUS Confidence Model

**Authoritative reference for confidence semantics across the platform.**

---

## Overview

NEXUS uses multiple confidence-related values. Each has distinct meaning, timing, and determinism. This document clarifies what each confidence represents and where it appears in the UI and APIs.

---

## Confidence Types

### 1. Decision Confidence (at execution time)

| Property | Value |
|----------|-------|
| **Meaning** | Snapshot of combined confidence at the moment the decision pipeline completed |
| **When calculated** | At pipeline completion (Execute → Infer → Optimize → Evaluate → Trust) |
| **Deterministic?** | **Yes** — same run always yields the same value |
| **Source** | Average of Intelligence, AI inference, and Trust confidences from run results |
| **API fields** | `evaluate.confidence`, `infer.outputs.confidence`, `trust.confidence` (response payloads) |
| **UI surface** | **Decision page** — "Decision Confidence (at execution time)" |
| **Storage** | In-memory run state (`StateService`, `HistoryService`) |

**Why values may differ:** Decision confidence is computed once per run and stored. It does not change when you revisit the page or when platform health changes.

---

### 2. Intelligence Confidence

| Property | Value |
|----------|-------|
| **Meaning** | Reasoning quality / evidence strength from the Intelligence evaluation engine |
| **When calculated** | During the Evaluate step of the pipeline |
| **Deterministic?** | **Yes** — same inputs always yield the same value |
| **Source** | `POST /api/Intelligence/evaluate` → `confidence` in response |
| **API fields** | `outcome`, `confidence`, `payload` (Intelligence evaluate response) |
| **UI surface** | Decision page (Engine contributions → Evaluation card); contributes to Decision Confidence |

**Why values may differ:** Intelligence confidence varies with input structure and evidence. It is not time-dependent.

---

### 3. Trust Confidence (Current Platform Trust)

| Property | Value |
|----------|-------|
| **Meaning** | Live platform trustworthiness based on current health, dependencies, and signals |
| **When calculated** | At request time — each call to `/api/Trust/health` recomputes |
| **Deterministic?** | **No** — time-dependent; platform state may change |
| **Source** | `GET /api/Trust/health` → `confidence` in response |
| **API fields** | `confidence`, `factors`, `status` (Trust health response) |
| **UI surface** | **Trust page** — "Current Platform Trust" |

**Why values may differ:** Trust confidence reflects current platform state. Health, dependency readiness, and latency signals can change over time.

---

### 4. Trust at Decision Time

| Property | Value |
|----------|-------|
| **Meaning** | Trust confidence captured when the pipeline run completed |
| **When calculated** | During the Trust step of the pipeline; stored in run snapshot |
| **Deterministic?** | **Yes** — frozen for that run; does not change |
| **Source** | Stored in `results.trust.confidence` from the pipeline run |
| **API fields** | Same as Trust health response, but captured at run time |
| **UI surface** | **Trust page** — "Trust at decision time" (when run has trust data) |

**Why values may differ from Current Platform Trust:** Trust at decision time is a snapshot. Current Platform Trust is live. They will differ when platform health changes between the run and when you view the Trust page.

---

## UI Data Sources

| Page | Data source | Confidence shown |
|------|-------------|------------------|
| **Decision** | Stored run results only | Decision Confidence (average of evaluate, infer, trust from snapshot) |
| **Trust** | Live `/api/Trust/health` + stored run results | Current Platform Trust (live) + Trust at decision time (snapshot, when available) |

**Important:** The Decision page never fetches live Trust. It only uses data from the pipeline run. The Trust page fetches live Trust and also displays the historical Trust value from the run when available.

---

## Why Values Differ Across Pages

1. **Decision vs Trust page**
   - Decision shows **averaged** confidence from the run snapshot.
   - Trust shows **live** platform trust (and optionally trust-at-decision-time).
   - Different formulas and different data sources → different values.

2. **Two identical runs at different times**
   - **Decision confidence:** Should remain the same for identical inputs (deterministic engines).
   - **Trust confidence (live):** May change if platform health or dependencies change between runs.

3. **Revisiting a run**
   - Decision confidence: Same (from stored snapshot).
   - Trust "at decision time": Same (from stored snapshot).
   - Trust "Current Platform Trust": May differ (live fetch).

---

## API Contract (unchanged)

- No API fields are renamed or removed.
- `confidence` remains the field name in all responses.
- This document clarifies semantics only; it does not alter contracts.

---

## For Developers

When adding new confidence-related features:

1. Determine whether the value is **snapshot** (run-time) or **live** (request-time).
2. Use the correct data source (stored results vs live API).
3. Label clearly in the UI to avoid confusion.
4. Update this document if new confidence types are introduced.
