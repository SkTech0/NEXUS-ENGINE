"""Engine Distributed — errors (ERL-4)."""
from errors.error_model import (
    ERROR_CODES,
    ERROR_TYPES,
    DependencyError,
    EngineError,
    ExecutionError,
    NetworkError,
    PartitionError,
    TimeoutError,
    ValidationError,
)

__all__ = [
    "ERROR_CODES",
    "ERROR_TYPES",
    "ValidationError",
    "EngineError",
    "DependencyError",
    "TimeoutError",
    "ExecutionError",
    "NetworkError",
    "PartitionError",
]
