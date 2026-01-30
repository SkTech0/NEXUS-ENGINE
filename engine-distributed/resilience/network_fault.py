"""
Engine Distributed — Network fault handling and partition guards (ERL-4).
Network fault handling, partition tolerance, split-brain protection, recovery hooks.
"""
from __future__ import annotations

from typing import Any, Callable, TypeVar

T = TypeVar("T")


def network_fault_handling(
    fn: Callable[[], T],
    *,
    fallback: T | None = None,
    on_network_error: Callable[[Exception], None] | None = None,
) -> T | None:
    """
    Run fn; on network-related exception return fallback and optionally call on_network_error.
    Graceful degradation for network faults.
    """
    try:
        return fn()
    except Exception as e:
        if on_network_error is not None:
            on_network_error(e)
        return fallback


def partition_tolerance_guard(
    quorum_ok: bool,
    *,
    reject_on_no_quorum: bool = True,
) -> bool:
    """
    Partition tolerance guard: reject operation if quorum not reached (split-brain protection).
    Returns True if operation is safe to proceed.
    """
    if reject_on_no_quorum and not quorum_ok:
        return False
    return True


def state_consistency_check(local_state: Any, expected_version: int | None = None) -> bool:
    """
    Stub: state consistency check. Override in engines for real consistency checks.
    """
    return True


def recovery_hook(operation: str, context: dict[str, Any] | None = None) -> None:
    """
    Stub: recovery hook after partition or failure. Override in engines.
    """
    pass
