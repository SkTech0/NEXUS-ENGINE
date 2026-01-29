"""Pipeline-style tests for engine-optimization."""
import pytest
from schedulers.scheduler import create_scheduler, Task
from allocators.resource_allocator import create_resource_allocator, Resource


class TestOptimizationPipeline:
    def test_schedule_then_allocate_flow(self):
        s = create_scheduler()
        s.add_task(Task("j1", 5.0, priority=1))
        slots = s.schedule()
        assert len(slots) >= 1
        a = create_resource_allocator()
        a.add_resource(Resource("cpu", 4.0))
        a.set_demand("j1", {"cpu": 2.0})
        allocs = a.allocate()
        assert any(al.consumer_id == "j1" for al in allocs)
