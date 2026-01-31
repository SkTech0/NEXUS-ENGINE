# Evidence Bundle

This document defines the **EvidenceBundle**: the container in which engine-data supplies multiple evidence items to engine-intelligence. Raw arrays of evidence are not sufficient; bundles carry identity, completeness, and determinism information required for safe consumption and audit.

---

## Why Bundles Instead of Raw Arrays

Supplying a bare list of evidence items would:

- **Lose request identity.** Intelligence could not correlate “this set of evidence” with a specific query or decision. Traceability and debugging require a stable query or request id.
- **Hide completeness.** The consumer would not know whether the set is complete (all requested evidence returned) or partial (timeout, limit, or failure). Completeness affects whether reasoning may proceed or must be downgraded.
- **Undermine reproducibility.** Without a determinism or version signal, the same logical request could not be checked for identical evidence sets across runs. Audits and certification need reproducibility.

An **EvidenceBundle** therefore groups evidence with a query id, a completeness indicator, and an optional determinism hash. It is the only form in which a set of evidence is supplied across the data–intelligence boundary under DEC.

---

## EvidenceBundle Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **queryId** | string | Yes | Unique identifier for the query or request that produced this bundle. Ties the bundle to a specific invocation for traceability, idempotency, and audit. |
| **evidence** | Evidence[] | Yes | Ordered list of Evidence items. May be empty if no evidence matched or an error occurred (see completeness). |
| **count** | integer | Yes | Number of items in evidence. Must equal evidence.length. Redundant but supports quick checks and schema validation. |
| **completeness** | Completeness | Yes | Indicates whether the result set is complete, partial, or failed. See below. |
| **determinismHash** | string | No | Optional hash of (queryId + canonical representation of evidence ids and types). Enables reproducibility checks: same query and evidence set yields same hash. |

---

## Completeness

The **completeness** field describes whether the bundle contains everything the data engine intended to return for this query.

| Value | Meaning |
|-------|---------|
| **complete** | All evidence that matched the query is included. Reasoning may treat the bundle as a full picture for that query. |
| **partial** | Only a subset was returned (e.g. limit reached, timeout, or partial failure). Intelligence should consider downgrading confidence or marking the outcome as “partial evidence.” |
| **failed** | The query could not be satisfied (e.g. error, unavailable index). evidence may be empty or stale fallback. Intelligence should not treat the bundle as authoritative. |

Completeness is required so that engine-intelligence can decide whether to proceed, request retry, or surface “insufficient evidence” without guessing from count or payloads.

---

## Determinism Hash

- **Purpose:** Reproducibility and audit. Same query + same evidence set (by id and type) should yield the same determinismHash so that reruns and audits can verify identical evidence.
- **Scope:** Hash input must include queryId and a canonical representation of evidence (e.g. sorted evidence ids and types). Exact algorithm is not prescribed; implementations must document their choice.
- **Optional:** When not present, consumers cannot verify reproducibility from the bundle alone. Recommended for certification and high-assurance flows.

---

## Conformance

Implementations that supply evidence sets to engine-intelligence under DEC must wrap them in an EvidenceBundle with queryId, evidence, count, and completeness. determinismHash is optional but recommended where reproducibility is required. Consumers may reject or treat as incomplete any response that does not conform to the bundle contract.
