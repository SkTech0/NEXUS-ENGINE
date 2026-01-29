"""
Vector clocks for causal ordering in distributed systems.
Modular, testable functions.
"""
from typing import Any


def create_vector_clock(node_ids: list[str] | None = None) -> dict[str, int]:
    """Create a new vector clock (all zeros). Testable."""
    if node_ids is None:
        return {}
    return {nid: 0 for nid in node_ids}


def increment(clock: dict[str, int], node_id: str) -> dict[str, int]:
    """Increment this node's counter. Returns new clock (immutable)."""
    new_clock = dict(clock)
    new_clock[node_id] = new_clock.get(node_id, 0) + 1
    return new_clock


def merge(local: dict[str, int], remote: dict[str, int]) -> dict[str, int]:
    """Merge two vector clocks (element-wise max). Testable."""
    result = dict(local)
    for node_id, tick in remote.items():
        result[node_id] = max(result.get(node_id, 0), tick)
    return result


def happens_before(a: dict[str, int], b: dict[str, int]) -> bool:
    """
    True iff a happened before b (a < b): all a[i] <= b[i] and at least one strictly less.
    """
    if not a and not b:
        return False
    all_nodes = set(a) | set(b)
    strictly_less = False
    for n in all_nodes:
        va, vb = a.get(n, 0), b.get(n, 0)
        if va > vb:
            return False
        if va < vb:
            strictly_less = True
    return strictly_less


def concurrent(a: dict[str, int], b: dict[str, int]) -> bool:
    """True iff a and b are concurrent (neither happens before the other)."""
    return not happens_before(a, b) and not happens_before(b, a)


def equals(a: dict[str, int], b: dict[str, int]) -> bool:
    """True iff both clocks are equal."""
    return a == b
