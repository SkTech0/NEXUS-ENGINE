# Chaos Engineering Standards

**Status:** Standard  
**Owner:** Platform Operations  
**Classification:** Ops — Chaos  
**Version:** 1.0

---

## 1. Purpose

This document defines chaos engineering standards for NEXUS: how experiments are designed, executed, and reviewed to validate resilience and fault tolerance without causing unacceptable impact. Chaos engineering is required for confidence in production behavior under failure.

---

## 2. Principles

- **Hypothesis-driven:** Every chaos experiment MUST have a clear hypothesis (e.g., “if dependency X fails, platform degrades gracefully and recovers within RTO”).
- **Blast radius controlled:** Experiments MUST be scoped to limit impact (e.g., single AZ, single tenant, or canary); MUST have abort and rollback.
- **Production-like:** Experiments SHOULD run in production-like environments (e.g., staging, or controlled production) so that behavior is representative; production experiments MUST be minimal and approved.
- **Blameless:** Findings are used to improve systems and runbooks; not to blame individuals.

---

## 3. Experiment Lifecycle

### 3.1 Design

- **Hypothesis:** State what is being tested and expected outcome.
- **Scope:** Target (service, AZ, tenant), duration, and abort criteria.
- **Safety:** Abort mechanism (e.g., automatic rollback after N minutes, or on SLO breach); notification to on-call.
- **Approval:** Experiments that affect production MUST be approved per policy; staging experiments MAY be pre-approved within scope.

### 3.2 Execution

- **Schedule:** Execute during low-risk windows (e.g., business hours with on-call available) unless otherwise approved.
- **Monitor:** SLI/SLO and error budget MUST be monitored during experiment; abort if impact exceeds threshold.
- **Document:** Start time, end time, observations, and any incidents recorded.

### 3.3 Review

- **Post-experiment review:** Validate hypothesis; document gaps (e.g., missing circuit breaker, runbook gap).
- **Action items:** Fixes and improvements assigned and tracked; runbooks updated where needed.

---

## 4. Experiment Types

### 4.1 Dependency Failure

- **Example:** Kill or partition a dependency (e.g., database, engine, external API).
- **Validates:** Circuit breakers, timeouts, fallbacks, and degradation behavior.

### 4.2 Resource Exhaustion

- **Example:** Inject latency or limit CPU/memory.
- **Validates:** Backpressure, load shedding, and resource limits.

### 4.3 Network Partition

- **Example:** Partition network between components.
- **Validates:** Timeouts, retries, and consistency under partition.

### 4.4 Instance Failure

- **Example:** Terminate or crash a subset of instances.
- **Validates:** Orchestrator recovery, failover, and state recovery.

---

## 5. Safety and Compliance

- Chaos MUST NOT violate SLO or exhaust error budget beyond approved allowance; abort MUST be immediate if unintended impact occurs.
- Chaos MUST NOT run against regulated or critical tenants without explicit approval and scope.
- Experiments MUST be logged and auditable for compliance and improvement.

---

## 6. References

- [incident-response.md](./incident-response.md)
- [runbooks.md](./runbooks.md)
- [platform/distributed-standards/resilience.md](../platform/distributed-standards/resilience.md)
- [platform/distributed-standards/fault-tolerance.md](../platform/distributed-standards/fault-tolerance.md)
- [engine-core/specs/engine-failure-model.md](../engine-core/specs/engine-failure-model.md)
