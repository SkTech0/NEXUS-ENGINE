"""
Resource allocator — allocate limited resources to consumers.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


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
    Simple: proportional to demand up to capacity. Testable.
    """

    def __init__(self) -> None:
        self._resources: dict[str, Resource] = {}
        self._demands: dict[str, dict[str, float]] = {}

    def add_resource(self, resource: Resource) -> None:
        """Register resource. Testable."""
        self._resources[resource.id] = resource

    def set_demand(self, consumer_id: str, amounts: dict[str, float]) -> None:
        """Set demand per resource for consumer. Testable."""
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
        """Total capacity for resource. Testable."""
        r = self._resources.get(resource_id)
        return r.capacity if r is not None else 0.0


def create_resource_allocator() -> ResourceAllocator:
    """Create empty allocator. Testable."""
    return ResourceAllocator()
