"""Clocks: vector and logical (Lamport)."""
from .logical_clock import (
    LogicalClock,
    create_logical_clock,
    receive_timestamp,
    send_timestamp,
)
from .vector_clock import (
    concurrent,
    create_vector_clock,
    equals,
    happens_before,
    increment,
    merge,
)

__all__ = [
    "create_vector_clock",
    "increment",
    "merge",
    "happens_before",
    "concurrent",
    "equals",
    "LogicalClock",
    "create_logical_clock",
    "send_timestamp",
    "receive_timestamp",
]
