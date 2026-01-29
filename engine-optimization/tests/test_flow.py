"""Flow tests for engine-optimization."""
import pytest
from schedulers.scheduler import create_scheduler, Task
from allocators.resource_allocator import create_resource_allocator, Resource


class TestOptimizationFlow:
    def test_full_schedule_allocate_flow(self):
        s = create_scheduler()
        s.add_task(Task("job1", 1.0, priority=2))
        s.add_task(Task("job2", 2.0, priority=1))
        slots = s.schedule()
        a = create_resource_allocator()
        a.add_resource(Resource("cpu", 8.0))
        for sl in slots:
            if sl.task_id:
                a.set_demand(sl.task_id, {"cpu": 2.0})
        allocs = a.allocate()
        assert len(allocs) == 2
