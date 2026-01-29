"""Core unit tests for engine-optimization."""
import pytest
from schedulers.scheduler import Task, Slot, Scheduler, create_scheduler
from allocators.resource_allocator import (
    Resource,
    Allocation,
    ResourceAllocator,
    create_resource_allocator,
)


class TestScheduler:
    def test_create(self):
        s = create_scheduler()
        assert s is not None

    def test_add_task_schedule(self):
        s = create_scheduler()
        s.add_task(Task("t1", 2.0, priority=1))
        slots = s.schedule()
        assert len(slots) == 1
        assert slots[0].task_id == "t1"
        assert slots[0].end - slots[0].start == 2.0

    def test_priority_order(self):
        s = create_scheduler()
        s.add_task(Task("low", 1.0, priority=0))
        s.add_task(Task("high", 1.0, priority=2))
        slots = s.schedule()
        assert slots[0].task_id == "high"
        assert slots[1].task_id == "low"


class TestResourceAllocator:
    def test_create(self):
        a = create_resource_allocator()
        assert a is not None

    def test_allocate_single(self):
        a = create_resource_allocator()
        a.add_resource(Resource("r1", 100.0))
        a.set_demand("c1", {"r1": 50.0})
        allocs = a.allocate()
        assert len(allocs) == 1
        assert allocs[0].consumer_id == "c1"
        assert allocs[0].get("r1") == 50.0
