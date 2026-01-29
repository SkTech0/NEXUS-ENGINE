# Data Lineage

**Status:** Standard  
**Owner:** Platform Architecture / Data Governance  
**Classification:** Governance — Data  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS tracks data lineage: the provenance of data from source through transformation to consumption. Lineage is required for audit, compliance, debugging, and impact analysis.

---

## 2. Scope

- **Inputs:** Raw and derived inputs to engines (e.g., events, API payloads, reference data).
- **Transformations:** Pipelines, engines, and aggregations that produce or modify data.
- **Outputs:** Decisions, scores, and persisted state consumed by downstream systems or users.

---

## 3. Lineage Model

### 3.1 Entities

- **Dataset:** A logical unit of data (e.g., table, stream, snapshot) with a unique identifier and version.
- **Process:** An engine, pipeline, or job that reads and/or writes datasets.
- **Lineage edge:** (Dataset, Process, Dataset) — process reads from one dataset and writes to another (or same with new version).

### 3.2 Metadata Captured

- **Dataset:** ID, version, schema version, creation time, source (e.g., API, file, stream).
- **Process:** Engine/pipeline name, version, execution ID, correlation ID, timestamp.
- **Edge:** Read/write role, optional column or field mapping where applicable.

---

## 4. Capture Requirements

- Every engine execution that reads or writes data SHOULD record lineage edges (dataset in, process, dataset out) with correlation ID and timestamp.
- Persisted outputs (decisions, state) MUST reference the process and input dataset versions used to produce them.
- Retention of lineage metadata MUST align with governance and compliance policy; access MUST be access-controlled and audited.

---

## 5. Use Cases

- **Audit:** Trace a decision back to its input data and transformation steps.
- **Impact analysis:** Determine which downstream consumers are affected by a change to a dataset or process.
- **Debugging:** Reproduce or explain a result by following lineage.
- **Compliance:** Demonstrate provenance for regulated data (e.g., GDPR, sectoral regulations).

---

## 6. References

- [decision-lineage.md](./decision-lineage.md)
- [state-model.md](./state-model.md)
- [causality.md](./causality.md)
- [engine-core/specs/engine-replay.md](../../engine-core/specs/engine-replay.md)
