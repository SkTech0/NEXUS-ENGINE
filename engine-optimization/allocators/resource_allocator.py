"""
Resource allocator — allocate limited resources to consumers.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-optimization")


@dataclass
class Resource:
    """A resource: id and capacity."""

    id: str
    capacity: float


@dataclass
class Allocation:
    """Allocation: consumer_id -> amount per resource."""

    consumer_id: str
    amounts: dict[str, float] = field(default_factory=dict)

    def get(self, resource_id: str) -> float:
        """Amount allocated for resource. Testable."""
        return self.amounts.get(resource_id, 0.0)


class ResourceAllocator:
    """
    Allocator: register resources and demands; allocate() returns allocations.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._resources: dict[str, Resource] = {}
        self._demands: dict[str, dict[str, float]] = {}

    def add_resource(self, resource: Resource) -> None:
        """Register resource. Validates resource id and capacity before state mutation."""
        if resource is None:
            raise ValidationError("resource is required", details={"field": "resource"})
        if not (resource.id or "").strip():
            raise ValidationError("resource id is required", details={"field": "id"})
        if resource.capacity < 0:
            raise ValidationError("resource capacity must be non-negative", details={"field": "capacity"})
        self._resources[resource.id] = resource
        _logger.debug("resource_allocator.add_resource id=%s capacity=%s", resource.id, resource.capacity)

    def set_demand(self, consumer_id: str, amounts: dict[str, float]) -> None:
        """Set demand per resource for consumer. Validates consumer_id and amounts."""
        if not (consumer_id or "").strip():
            raise ValidationError("consumer_id is required", details={"field": "consumer_id"})
        if amounts is None:
            amounts = {}
        self._demands[consumer_id] = dict(amounts)

    def allocate(self) -> list[Allocation]:
        """
        Allocate: for each resource, split capacity among consumers by demand proportion.
        Returns list of Allocation. Testable.
        """
        allocations: list[Allocation] = []
        for consumer_id, demand in self._demands.items():
            amounts: dict[str, float] = {}
            for res_id, cap in self._resources.items():
                d = demand.get(res_id, 0.0)
                total_demand = sum(
                    self._demands.get(c, {}).get(res_id, 0.0) for c in self._demands
                )
                if total_demand <= 0:
                    amounts[res_id] = 0.0
                else:
                    amounts[res_id] = cap * (d / total_demand)
            allocations.append(Allocation(consumer_id=consumer_id, amounts=amounts))
        return allocations

    def get_available(self, resource_id: str) -> float:
        """Total capacity for resource. Validates resource_id non-empty."""
        if not (resource_id or "").strip():
            raise ValidationError("resource_id is required", details={"field": "resource_id"})
        r = self._resources.get(resource_id)
        return r.capacity if r is not None else 0.0


def create_resource_allocator() -> ResourceAllocator:
    """Create empty allocator. Testable."""
    return ResourceAllocator()
