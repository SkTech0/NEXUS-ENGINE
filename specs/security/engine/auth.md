# Engine Authentication

**Status:** Standard  
**Owner:** Platform Architecture / Security  
**Classification:** Security — Engine Auth  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS engines and platform components authenticate: how identity is verified for API calls, engine-to-engine calls, and system-to-system integration. Authentication is required for zero-trust and commercial deployment.

---

## 2. Authentication Flows

### 2.1 Consumer / API Authentication

- **Definition:** Verification of the caller (user, tenant, or system) when calling platform APIs.
- **Mechanisms:** API keys, OAuth2/OIDC tokens, mTLS client certificates, or other platform-approved mechanisms.
- **Requirements:** Every API that is not explicitly public MUST require authentication; authentication failure MUST result in 401 Unauthorized.

### 2.2 Engine-to-Engine Authentication

- **Definition:** Verification of the caller when one engine or service calls another.
- **Mechanisms:** Service accounts with JWT or API keys, mTLS, or internal token exchange.
- **Requirements:** Caller identity MUST be verified; unauthenticated internal calls MUST be rejected unless explicitly allowed by policy (e.g., trusted network segment with other controls).

### 2.3 System / Machine Authentication

- **Definition:** Verification of external systems (e.g., data feeds, webhooks, partners).
- **Mechanisms:** API keys, mTLS, or OAuth2 client credentials; MUST be documented per integration.
- **Requirements:** Credentials MUST be stored and rotated per secrets policy; least privilege MUST apply.

---

## 3. Token and Credential Management

- **Secrets:** API keys, passwords, and tokens MUST NOT be logged or exposed in responses; MUST be stored in a secrets manager or secure config per secrets policy.
- **Rotation:** Credentials and tokens MUST support rotation; rotation procedure MUST be documented and tested.
- **Scope:** Tokens SHOULD have minimal scope (e.g., scoped to tenant, API, or operation) where supported.

---

## 4. Authentication Failures

- **401 Unauthorized:** Missing or invalid credentials; caller MAY retry with valid credentials.
- **403 Forbidden:** Authenticated but not authorized (see authz.md); response MUST NOT leak information about existence of resources.
- **Rate limiting:** Authentication endpoints MUST be rate-limited to prevent brute force; failures MUST be logged and optionally alerted.

---

## 5. References

- [identity.md](./identity.md)
- [authz.md](./authz.md)
- [trust-model.md](./trust-model.md)
- [zero-trust.md](./zero-trust.md)
- [policy.md](./policy.md)
