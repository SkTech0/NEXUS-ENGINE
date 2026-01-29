"""
Leader election — elect a leader from a set of nodes.
Modular, testable (e.g. bully-style by node id).
"""
from dataclasses import dataclass


@dataclass
class ElectionResult:
    """Result of an election: winner and term/round."""

    leader_id: str
    term: int


def elect_leader_bully(node_ids: list[str], failed: set[str] | None = None) -> str | None:
    """
    Bully algorithm: highest id among live nodes wins.
    Returns leader_id or None if no nodes. Testable.
    """
    failed = failed or set()
    live = [n for n in node_ids if n not in failed]
    if not live:
        return None
    return max(live)


def elect_leader_ring(
    node_ids: list[str],
    coordinator_id: str | None = None,
) -> str | None:
    """
    Ring: optional coordinator starts election; highest id wins.
    Simplified: if coordinator given, they initiate; result is max(node_ids).
    Returns leader_id. Testable.
    """
    if not node_ids:
        return None
    return max(node_ids)


def run_election(
    node_ids: list[str],
    failed: set[str] | None = None,
    term: int = 0,
) -> ElectionResult | None:
    """
    Run election (bully) and return ElectionResult.
    Testable.
    """
    leader_id = elect_leader_bully(node_ids, failed=failed)
    if leader_id is None:
        return None
    return ElectionResult(leader_id=leader_id, term=term + 1)


def is_leader(node_id: str, leader_id: str | None) -> bool:
    """Check if node is current leader. Testable."""
    return leader_id is not None and node_id == leader_id
