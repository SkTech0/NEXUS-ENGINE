# Engine Idempotency Specification

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — Idempotency  
**Version:** 1.0

---

## 1. Purpose

This document defines idempotency requirements for NEXUS engine execution. Idempotency ensures that duplicate or retried requests do not cause incorrect duplicate effects, and supports safe retries and at-least-once delivery semantics.

---

## 2. Definitions

- **Idempotent operation:** Performing the operation one or more times with the same idempotency key has the same effect as performing it once.
- **Idempotency key:** A client- or platform-supplied key that uniquely identifies a logical request (e.g., client-generated UUID, correlation ID + step ID).

---

## 3. Requirements

### 3.1 Execution Contract

- For a given idempotency key, the engine MUST return the same result for repeated calls with the same logical input until the result expires or is invalidated per policy.
- The engine MUST NOT apply side effects (e.g., writes, outbound messages) more than once for the same idempotency key within the validity window.

### 3.2 Key Handling

- If the platform or client supplies an idempotency key, the engine MUST honor it: first request executes; subsequent requests with the same key return the stored result without re-executing (or re-execute in a way that produces the same effect).
- Key validity window (TTL) MUST be configurable and documented; after TTL, the same key MAY be treated as a new request.

### 3.3 Read vs Write

- Read-only operations are naturally idempotent; engines that perform only reads need not implement explicit key storage but MUST document this.
- Any engine that performs writes or outbound side effects MUST support idempotency keys for those operations or MUST document the at-most-once / compensating approach.

---

## 4. Storage of Idempotency State

- Idempotency result (output + status) MAY be stored in a dedicated store (e.g., cache or DB) keyed by idempotency key.
- Storage MUST be consistent with the engine’s consistency guarantees; retention MUST align with key TTL and audit requirements.

---

## 5. Interaction with Retries and Replay

- Retries that carry the same idempotency key are safe and MUST not double-apply effects.
- Replay (engine-replay.md) that uses the same idempotency key as the original run MUST return the same result and MUST NOT re-apply side effects unless explicitly configured for “re-run” (and then clearly distinguished in audit).

---

## 6. References

- [engine-contracts.md](./engine-contracts.md)
- [engine-replay.md](./engine-replay.md)
- [engine-determinism.md](./engine-determinism.md)
- [api-platform/contracts.md](../api-platform/contracts.md)
