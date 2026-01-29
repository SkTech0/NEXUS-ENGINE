"""
Audit logger — append-only log of events for audit.
Modular, testable.
"""
import time
from dataclasses import dataclass, field
from typing import Any


@dataclass
class AuditEntry:
    """An audit entry: timestamp, actor, action, resource, details."""

    timestamp: float
    actor: str
    action: str
    resource: str = ""
    details: dict[str, Any] = field(default_factory=dict)


class AuditLogger:
    """
    Audit log: append entries; query by actor, action, resource.
    Testable.
    """

    def __init__(self) -> None:
        self._entries: list[AuditEntry] = []

    def log(self, actor: str, action: str, resource: str = "", details: dict[str, Any] | None = None) -> AuditEntry:
        """Append audit entry. Returns the entry. Testable."""
        entry = AuditEntry(
            timestamp=time.time(),
            actor=actor,
            action=action,
            resource=resource,
            details=details or {},
        )
        self._entries.append(entry)
        return entry

    def entries(self) -> list[AuditEntry]:
        """All entries (order preserved). Testable."""
        return list(self._entries)

    def by_actor(self, actor: str) -> list[AuditEntry]:
        """Entries for actor. Testable."""
        return [e for e in self._entries if e.actor == actor]

    def by_action(self, action: str) -> list[AuditEntry]:
        """Entries for action. Testable."""
        return [e for e in self._entries if e.action == action]

    def by_resource(self, resource: str) -> list[AuditEntry]:
        """Entries for resource. Testable."""
        return [e for e in self._entries if e.resource == resource]


def create_audit_logger() -> AuditLogger:
    """Create audit logger. Testable."""
    return AuditLogger()
