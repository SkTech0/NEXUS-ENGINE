# Engine State Machine Model

**Status:** Standard  
**Owner:** Platform Architecture  
**Classification:** Engine Core — State  
**Version:** 1.0

---

## 1. Purpose

This document specifies the formal state machine for NEXUS engine instances. It defines states, events, transitions, and invariants so that orchestration, recovery, and auditing behave consistently across all engines.

---

## 2. State Machine Definition

### 2.1 States (Summary)

- **UNINIT** — Not initialized.
- **INIT** — Initializing (config, dependencies).
- **READY** — Ready to accept work.
- **RUNNING** — Actively executing.
- **DEGRADED** — Running with reduced capability.
- **DRAIN** — Draining (no new work, finishing in-flight).
- **STOPPED** — Stopped gracefully.
- **FAILED** — Error state requiring intervention.
- **TERMINATED** — Instance destroyed.

### 2.2 Events

| Event | Description | Typical Trigger |
|-------|-------------|-----------------|
| `init` | Begin initialization | Bootstrap, orchestration |
| `ready` | Mark ready | Init success |
| `start` | Begin execution | API or scheduler |
| `degrade` | Enter degraded mode | SLO breach, dependency down |
| `recover` | Return to normal | Dependency restored |
| `drain` | Begin drain | Shutdown, scale-in |
| `stop` | Stop execution | Drain complete or force |
| `fail` | Enter failed state | Unhandled error, invariant violation |
| `terminate` | Destroy instance | Teardown |

### 2.3 Valid Transition Matrix

| From \ To | INIT | READY | RUNNING | DEGRADED | DRAIN | STOPPED | FAILED | TERM |
|-----------|------|-------|---------|----------|------|--------|-------|-----|
| UNINIT    | ✓    | —     | —       | —        | —    | —      | —     | —   |
| INIT      | —    | ✓     | —       | —        | —    | —      | ✓     | —   |
| READY     | —    | —     | ✓       | —        | ✓    | —      | ✓     | —   |
| RUNNING   | —    | ✓     | —       | ✓        | ✓    | —      | ✓     | —   |
| DEGRADED  | —    | ✓     | ✓       | —        | ✓    | —      | ✓     | —   |
| DRAIN     | —    | —     | —       | —        | —    | ✓      | ✓     | —   |
| STOPPED   | ✓    | —     | —       | —        | —    | —      | —     | ✓   |
| FAILED    | ✓    | —     | —       | —        | —    | —      | —     | ✓   |
| TERM      | —    | —     | —       | —        | —    | —      | —     | —   |

---

## 3. Invariants

- At most one state per engine instance at any time.
- No transition from TERMINATED.
- DRAIN and STOPPED are terminal for a given lifecycle unless explicitly re-init or terminate.
- FAILED state MUST be recorded with reason and timestamp for audit.

---

## 4. Persistence of State

- Current state MAY be persisted for recovery after process restart.
- On restart, engine MUST restore state from persistent store (if used) and resume from that state where safe; otherwise treat as UNINIT and re-initialize.

---

## 5. References

- [engine-lifecycle.md](./engine-lifecycle.md)
- [engine-recovery-model.md](./engine-recovery-model.md)
