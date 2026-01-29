# Quality of Service (QoS) Policies

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Distributed System — QoS  
**Version:** 1.0

---

## 1. Purpose

This document defines Quality of Service policies for NEXUS: rate limiting, priority routing, resource allocation, and fairness so that the platform can meet differentiated SLAs and remain stable under load.

---

## 2. Rate Limiting

### 2.1 Scope

- **Per consumer/tenant:** Limits MUST be configurable per API key, tenant, or identity.
- **Per endpoint/operation:** Limits MAY be applied per endpoint or per engine operation.
- **Global:** Platform MAY enforce global limits to protect shared infrastructure.

### 2.2 Behavior

- When limit is exceeded, the platform MUST return 429 Too Many Requests (or protocol-equivalent) and SHOULD include Retry-After or reset time.
- Rate limit state MUST be consistent across instances (e.g., distributed counter or token bucket) where limits are enforced at multiple nodes.

---

## 3. Priority Routing

### 3.1 Priority Tiers

- **Critical:** Low latency, high availability; e.g., real-time decision APIs.
- **Standard:** Normal SLA.
- **Best-effort:** May be delayed or shed under load.

### 3.2 Requirements

- Priority MUST be expressed in the request (e.g., header, claim) or derived from tenant/contract.
- Schedulers and queues MUST consider priority when admitting and ordering work; higher priority MUST be preferred under contention.
- Load shedding MUST shed best-effort before standard, and standard before critical (see resilience, sla).

---

## 4. Resource Allocation

- CPU, memory, and I/O bounds per tenant or per engine MUST be configurable (e.g., cgroups, quotas).
- Exceeding resource allocation MUST result in backpressure or rejection for that tenant/engine, not unbounded consumption.

---

## 5. Fairness

- Under contention, allocation SHOULD be fair across tenants within the same tier (e.g., equal share or weighted fair queuing).
- Starvation of lower-priority work MUST be bounded (e.g., minimum share or timeout) where required by contract.

---

## 6. References

- [sla.md](./sla.md)
- [resilience.md](./resilience.md)
- [backpressure.md](./backpressure.md)
- [ops/slo.md](../../ops/slo.md)
