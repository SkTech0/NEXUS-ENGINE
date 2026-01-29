# Engine State Model

## Definition

**Engine state** is a snapshot of the runtime/operational state of engine components: health, mode (normal/degraded/maintenance), circuit breakers, caches, and other operational facets. This model defines the structure for correlating cognitive behavior with operational state—without altering runtime logic.

## Engine State Schema (Cognitive-Relevant Subset)

ECOL does not own full infrastructure state; it defines the **cognitive-relevant** subset that may affect reasoning or decisions.

```yaml
state_id: string
timestamp: ISO8601
scope: enum [component | service | domain | global]

# Target
component_id: string | null
service_id: string | null
domain: string | null

# Operational state (cognitive-relevant)
mode: enum [normal | degraded | maintenance | failover] | null
availability: enum [up | down | partial] | null
circuit_state: enum [closed | open | half_open] | null  # if applicable
cache_state: string | null  # e.g. warm, cold, invalidated

# Optional
metadata: map
```

## Mode Semantics

| Mode | Description | Cognitive impact |
|------|-------------|------------------|
| **normal** | Full capability | No constraint |
| **degraded** | Reduced capability (e.g. fallbacks active) | May trigger fallback paths |
| **maintenance** | Planned reduced capability | May reject or defer |
| **failover** | Failover in progress | May use backup path |

## Propagation Rules

1. **Scope**: state is scoped to component, service, domain, or global; at least one of component_id, service_id, domain is set when scope is not global.
2. **Timeline**: Multiple snapshots over time form a timeline of engine state; used to explain why fallback or degradation occurred at a given time.
3. **No business logic**: Engine state is observed only; no decision logic should be changed by ECOL based on this state (engine may already use it; ECOL just records it).

## Relationship to Other Models

- **Failure/degradation**: failures/degradation-model.md defines degradation; engine state is the snapshot of mode/availability.
- **Recovery**: recovery/stabilization.md defines stabilization; engine state after recovery can be observed (mode back to normal).

## Contract

- Engine state snapshots are emitted by existing operational systems or at instrumentation boundaries; ECOL consumes or records them.
- Additive only; no change to runtime or health logic.
