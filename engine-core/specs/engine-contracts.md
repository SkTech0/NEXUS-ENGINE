# Engine Interface Contracts

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Contracts  
**Version:** 1.0

---

## 1. Purpose

This document defines the formal interface contracts that all NEXUS engines MUST satisfy. Contracts are the binding agreement between the platform and engine implementations; they enable substitutability, testing, and commercial licensing.

---

## 2. Contract Hierarchy

### 2.1 Primary Execution Contract

Every engine MUST implement the **Engine Port** (execution contract):

- **Operation:** `execute(input: unknown): Promise<unknown>`
- **Preconditions:** Input conforms to the engine’s declared input schema (if any).
- **Postconditions:** Returns a result that conforms to the engine’s declared output schema; does not mutate shared mutable state in an unspecified way.
- **Error contract:** Failures are signaled via rejected Promise or typed error; no silent swallowing of errors.

### 2.2 Identity Contract

- **Property:** `readonly name: string`
- **Constraint:** Stable, unique within a deployment scope; used for routing, logging, and audit.

### 2.3 Lifecycle Contract

Engines MUST participate in the platform lifecycle (see [engine-lifecycle.md](./engine-lifecycle.md)):

- Expose current state.
- Honor transition requests (start, stop, drain).
- Implement required lifecycle hooks where applicable.

### 2.4 Health Contract

- **Endpoint or method:** Health check that returns status (e.g., healthy / degraded / unhealthy) and optional detail.
- **Liveness:** Engine is alive and can make progress.
- **Readiness:** Engine is ready to accept work (dependencies available, not draining).

---

## 3. Input/Output Schemas

- Engines that accept structured input MUST declare an input schema (e.g., JSON Schema, OpenAPI).
- Engines that produce structured output MUST declare an output schema.
- Schema versions MUST be documented and tied to engine version for compatibility.

---

## 4. Error and Timeout Contract

- **Errors:** Typed error codes or hierarchy; no generic-only errors for operational failures.
- **Timeouts:** Execution MUST respect a configurable timeout; on timeout, the engine MUST release resources and return a timeout error (no indefinite hang).

---

## 5. Backward Compatibility

- New minor versions of an engine MUST remain backward-compatible with the declared contract for that major version.
- Breaking changes to the execution contract or schemas require a new major version and deprecation process (see api-platform/deprecation.md).

---

## 6. Contract Verification

- Contract compliance MUST be verifiable by automated tests (contract tests).
- Platform MAY reject engine registration if contract validation fails.

---

## 7. References

- [engine-lifecycle.md](./engine-lifecycle.md)
- [engine-states.md](./engine-states.md)
- [api-platform/contracts.md](../api-platform/contracts.md)
