"""
Replication engine — log replication and replica management.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class ReplicatedEntry:
    """A replicated log entry with index and term."""

    index: int
    term: int
    data: Any


@dataclass
class ReplicationEngine:
    """
    In-memory replication engine: log + list of replica ids.
    Apply callback is testable.
    """

    node_id: str
    log: list[ReplicatedEntry] = field(default_factory=list)
    replicas: list[str] = field(default_factory=list)
    apply_fn: Callable[[ReplicatedEntry], None] | None = None

    def append(self, term: int, data: Any) -> ReplicatedEntry:
        """Append entry to local log. Returns the entry. Testable."""
        index = len(self.log)
        entry = ReplicatedEntry(index=index, term=term, data=data)
        self.log.append(entry)
        if self.apply_fn:
            self.apply_fn(entry)
        return entry

    def get_entry(self, index: int) -> ReplicatedEntry | None:
        """Get entry by index. Testable."""
        if 0 <= index < len(self.log):
            return self.log[index]
        return None

    def get_replicas(self) -> list[str]:
        """Return list of replica node ids. Testable."""
        return list(self.replicas)

    def add_replica(self, replica_id: str) -> None:
        """Register a replica. Testable."""
        if replica_id not in self.replicas:
            self.replicas.append(replica_id)

    def remove_replica(self, replica_id: str) -> None:
        """Unregister a replica. Testable."""
        if replica_id in self.replicas:
            self.replicas.remove(replica_id)

    def last_index(self) -> int:
        """Last log index (-1 if empty). Testable."""
        return len(self.log) - 1

    def last_term(self) -> int:
        """Term of last entry (0 if empty). Testable."""
        if not self.log:
            return 0
        return self.log[-1].term

    def sync_from(self, entries: list[ReplicatedEntry], from_index: int) -> bool:
        """
        Overwrite log from from_index with given entries (e.g. from leader).
        Returns True if applied. Testable.
        """
        if from_index < 0 or from_index > len(self.log):
            return False
        self.log = self.log[:from_index] + list(entries)
        for entry in entries:
            if self.apply_fn:
                self.apply_fn(entry)
        return True


def create_replication_engine(
    node_id: str,
    replicas: list[str] | None = None,
    apply_fn: Callable[[ReplicatedEntry], None] | None = None,
) -> ReplicationEngine:
    """Create a replication engine. Testable."""
    return ReplicationEngine(
        node_id=node_id,
        replicas=replicas or [],
        apply_fn=apply_fn,
    )
