## API versioning

This document defines how Nexus Engine APIs are versioned, routed, and kept compatible.

### Goals

- Support multiple API versions concurrently.
- Enable safe upgrades with clear compatibility guarantees.
- Provide a deprecation lifecycle for retiring old versions.

### Version scheme

API versions use SemVer in the form:

- `v<MAJOR>` for routing (e.g. `v1`, `v2`)
- optional minor/patch negotiated via headers for clients that need granularity

### Routing strategy

Preferred (in order):

1. **URL path versioning** (most explicit):
   - `/api/v1/...`
2. **Header-based negotiation** (fine-grained capability):
   - `X-Api-Version: 1.2`
3. **Media type versioning** (advanced):
   - `Accept: application/vnd.nexus-engine+json;version=1`

### Backward and forward compatibility

- **Backward compatible** within a MAJOR:
  - additive fields in requests/responses
  - additive endpoints
  - new optional headers/parameters
- **Breaking**:
  - removing/changing required fields
  - changing meanings of existing fields
  - changing error semantics clients depend on

### Compatibility contract

- Servers should accept requests from **older MINOR/PATCH clients** within same MAJOR.
- Servers should return responses that **older clients can safely ignore**:
  - new fields must be optional and documented
  - unknown fields must not break clients

### Version negotiation model

If a client provides a requested version:

- Select the highest compatible server version ≤ requested version.
- If no compatible version exists:
  - return a structured error indicating supported versions
  - include an upgrade hint (link to upgrade policy)

### Deprecation lifecycle

All removals must follow the policy in `deprecation-policy.md`:

- announce
- mark deprecated
- provide overlap window
- remove on the next MAJOR (or per policy exception)

