## Deprecation policy

This policy defines how features/APIs/schemas are deprecated and removed.

### Principles

- Deprecations are **announced** and **time-bounded**.
- Removals follow predictable **lifecycle stages**.
- Backward compatibility is preserved within a MAJOR unless an exception is approved.

### Deprecation lifecycle

1. **Announce**
   - Add release notes entry with rationale and replacement.
   - Provide migration guidance.
2. **Deprecate**
   - Mark deprecated in documentation and, where applicable, warnings.
   - Track usage metrics to estimate impact.
3. **Overlap window**
   - Support old and new behavior concurrently.
   - Provide feature flags or version routing where applicable.
4. **Removal**
   - Remove only in:
     - next MAJOR release by default, or
     - exceptional emergency case with approval (security/compliance) and clear comms.

### Support lifecycle alignment

Deprecation windows align with release channels:

- **Stable**: at least 1 minor release overlap
- **LTS**: deprecations may remain for the full LTS support window

### Required artifacts per deprecation

- tracking ticket / RFC reference
- replacement strategy
- migration/rollback guidance
- removal target release
- communication plan

