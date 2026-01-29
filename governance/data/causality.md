# Causality and Correlation

**Status:** Standard  
**Owner:** Platform Architecture / Data Governance  
**Classification:** Governance — Causality  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS establishes causality and correlation across distributed executions: correlation IDs, trace propagation, and causality chains. These are required for tracing, audit, and debugging.

---

## 2. Correlation IDs

### 2.1 Definition

A **correlation ID** is an identifier that ties together all operations belonging to a single logical request or workflow (e.g., one API call, one job, one decision flow).

### 2.2 Requirements

- **Generation:** Correlation ID MUST be generated at the edge (API gateway, job scheduler) or by the client; MUST be unique per logical request.
- **Propagation:** Every downstream call (engine, service, message) MUST carry the same correlation ID in headers, metadata, or payload.
- **Logging:** Every log line that pertains to the request MUST include the correlation ID so that logs can be filtered by request.
- **Storage:** Decisions and lineage MUST store the correlation ID (see decision-lineage.md).

### 2.3 Format

- Format MUST be documented (e.g., UUID, or prefixed ID with tenant/date); MUST be unique within the retention window.

---

## 3. Trace Propagation

- **Distributed tracing:** Where a tracing system (e.g., OpenTelemetry) is used, trace context (trace ID, span ID) MUST be propagated across process boundaries so that a single request is visible as one trace.
- **Span attributes:** Spans MUST include correlation ID, engine name, and (where applicable) decision ID so that traces can be correlated with lineage and logs.

---

## 4. Causality Chains

### 4.1 Definition

A **causality chain** is the ordered sequence of events that led to an outcome (e.g., request received → engine A → engine B → decision). Causality is implied by execution order and dependency graph (engine-orchestration).

### 4.2 Requirements

- **Ordering:** Within a single correlation ID, the order of engine invocations and decisions MUST be reconstructable from logs, traces, or lineage.
- **Causal consistency:** Reads that are causally after a write MUST see that write (or a later version) where causal consistency is promised (see temporal-model.md).
- **Cross-request causality:** Where one request triggers another (e.g., async job), a parent correlation ID or causal reference MUST be passed so that chains can be reconstructed.

---

## 5. References

- [decision-lineage.md](./decision-lineage.md)
- [data-lineage.md](./data-lineage.md)
- [temporal-model.md](./temporal-model.md)
- [engine-core/specs/engine-orchestration.md](../../engine-core/specs/engine-orchestration.md)
