"""Engine-level tests for engine-optimization."""
import pytest
from schedulers.scheduler import create_scheduler, Task
from allocators.resource_allocator import create_resource_allocator, Resource


class TestOptimizationEngine:
    def test_scheduler_engine(self):
        s = create_scheduler()
        s.set_time(10.0)
        s.add_task(Task("a", 3.0, priority=2))
        s.add_task(Task("b", 2.0, priority=1))
        slots = s.schedule()
        assert slots[0].start == 10.0
        assert slots[0].end == 13.0
        assert slots[1].start == 13.0

    def test_allocator_engine(self):
        a = create_resource_allocator()
        a.add_resource(Resource("r1", 100.0))
        a.add_resource(Resource("r2", 50.0))
        a.set_demand("c1", {"r1": 60.0, "r2": 20.0})
        a.set_demand("c2", {"r1": 40.0, "r2": 30.0})
        allocs = a.allocate()
        assert len(allocs) == 2
        total_r1 = sum(al.get("r1") for al in allocs)
        assert total_r1 <= 100.0 + 1e-6
