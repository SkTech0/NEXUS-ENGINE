# Engine Orchestration Rules

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Orchestration  
**Version:** 1.0

---

## 1. Purpose

This document defines the rules and expectations for orchestrating NEXUS engines: ordering, dependency resolution, scheduling, and coordination. It ensures that multi-engine workflows and distributed execution remain predictable and auditable.

---

## 2. Orchestration Principles

- **Explicit dependencies:** Execution order and data flow are defined by a declared dependency graph, not implicit ordering.
- **No hidden coupling:** Engines communicate via defined interfaces and contracts only.
- **Orchestrator authority:** A single logical orchestrator (or consensus) decides when an engine is invoked; engines do not arbitrarily call each other without policy.

---

## 3. Dependency Graph

- **Definition:** A directed acyclic graph (DAG) where nodes are engines (or steps) and edges are dependencies (A → B means B depends on A).
- **Semantics:** An engine MUST NOT execute until all its dependencies have completed successfully (or produced a result that satisfies the dependency contract).
- **Cycle detection:** Orchestration MUST reject configurations that introduce cycles.

---

## 4. Execution Graph

- **Definition:** The runtime instantiation of the dependency graph for a given request or job, including concrete inputs/outputs and correlation IDs.
- **Traceability:** Every execution graph instance MUST be associated with a correlation ID; every engine invocation within it MUST carry that correlation ID for tracing and audit.

---

## 5. Orchestration Rules

1. **Start condition:** An engine is eligible to run when all predecessor outputs are available and valid.
2. **Failure propagation:** If a predecessor fails, dependent engines MUST NOT be started unless policy explicitly allows fallback or default inputs.
3. **Timeout propagation:** If a predecessor times out, the orchestrator treats it per policy (fail, retry, or use default) and proceeds accordingly.
4. **Idempotency:** Re-execution of the same logical step with the same inputs MUST yield the same result (see engine-idempotency.md).
5. **Resource bounds:** Orchestration MUST respect concurrency limits, rate limits, and backpressure signals from engines.

---

## 6. Coordination and Discovery

- Engines MAY be discovered via a registry or service discovery; discovery MUST return only engines that are in READY or RUNNING state (or per policy).
- Cross-engine calls MUST use platform-approved channels (e.g., API, message bus) and MUST carry correlation and tenant context.

---

## 7. References

- [engine-lifecycle.md](./engine-lifecycle.md)
- [engine-failure-model.md](./engine-failure-model.md)
- [engine-idempotency.md](./engine-idempotency.md)
- [platform/distributed-standards/resilience.md](../platform/distributed-standards/resilience.md)
