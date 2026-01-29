# SSO Integration

## Purpose

Define SSO (single sign-on) integration for NEXUS-ENGINE: how the engine supports enterprise SSO. Additive; no change to engine behavior.

## Principles

- Engine does not implement SSO; authentication is at platform or API gateway.
- SSO (e.g., SAML, OIDC) is used for user authentication; engine receives authenticated context.
- SSO supports enterprise procurement and regulatory requirements (e.g., identity assurance).

## Integration Points

| Point | Description |
|-------|-------------|
| Identity provider | Enterprise IdP (e.g., Okta, Azure AD) authenticates user. |
| API gateway / platform | Gateway validates SSO token or session; passes identity to engine. |
| Engine | Receives authenticated request; logs identity in audit. |

## Engine Support

- Engine does not validate SSO tokens; platform or gateway does.
- Engine audit events include actor identity as provided by platform.
- No engine logic or API changes required.

## Certification Readiness

- SSO integration documented; implementation is enterprise-specific.
- No engine logic or API changes required.
