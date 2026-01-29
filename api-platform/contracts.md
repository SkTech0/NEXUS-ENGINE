# Consumer Contracts and API Contracts

**Status:** Standard  
**Owner:** Platform Architecture / API  
**Classification:** API Platform — Contracts  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS expresses and enforces API contracts: request/response schemas, error contracts, and consumer guarantees. Contracts are the basis for compatibility, testing, and SDK generation.

---

## 2. Contract Definition

### 2.1 Request Contract

- **Schema:** Request body and query/header parameters MUST be defined (e.g., OpenAPI, JSON Schema).
- **Validation:** Server MUST validate requests against schema; invalid requests MUST return 400 with clear error (e.g., field-level errors).
- **Versioning:** Schema version MUST align with API version; backward compatibility per compatibility.md.

### 2.2 Response Contract

- **Schema:** Response body and status codes MUST be defined (e.g., 200 + schema, 4xx/5xx + error schema).
- **Stability:** Response shape MUST be stable within major version; additive changes only (new optional fields).
- **Error contract:** Error response MUST have consistent structure (e.g., code, message, correlation ID); see engine-core/specs/engine-contracts.md.

### 2.3 Behavioral Contract

- **Semantics:** Documented behavior (e.g., idempotency, timeout, retry) is part of the contract; changes that affect behavior are breaking unless explicitly additive (e.g., new optional header).
- **SLA:** Documented SLA (availability, latency) is a consumer-facing commitment; see platform/distributed-standards/sla.md.

---

## 3. Consumer Contracts

- **Definition:** The set of guarantees the platform makes to consumers (e.g., “v1 API will remain backward-compatible until sunset date”).
- **Explicit:** Consumer contract MUST be documented (e.g., in API docs, terms, or SLA); deprecation and compatibility rules are part of it.
- **Stability:** Platform MUST not break consumer contract within supported versions; breaking changes require new version and deprecation process.

---

## 4. Contract Testing

- **Contract tests:** Request/response schemas MUST be validated in CI (e.g., OpenAPI validation, contract tests against mock or stub).
- **Consumer-driven:** Where applicable, consumer-driven contract tests (e.g., Pact) MAY be used to ensure provider does not break consumer expectations.
- **Engine contracts:** Engine execution contracts (engine-core/specs/engine-contracts.md) MUST be tested; API contracts MAY wrap engine contracts.

---

## 5. References

- [versioning.md](./versioning.md)
- [compatibility.md](./compatibility.md)
- [api-governance.md](./api-governance.md)
- [sdk-strategy.md](./sdk-strategy.md)
- [engine-core/specs/engine-contracts.md](../engine-core/specs/engine-contracts.md)
