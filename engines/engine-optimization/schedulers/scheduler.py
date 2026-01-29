"""
Scheduler — schedule tasks on resources with optional priorities and deadlines.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Task:
    """A task: id, duration, priority, optional deadline."""

    id: str
    duration: float
    priority: int = 0
    deadline: float | None = None


@dataclass
class Slot:
    """A time slot: start, end, task_id or None."""

    start: float
    end: float
    task_id: str | None = None


class Scheduler:
    """
    In-memory scheduler: add tasks, schedule() returns list of slots.
    Simple policy: sort by priority (desc), then fill slots by duration.
    Testable.
    """

    def __init__(self) -> None:
        self._tasks: list[Task] = []
        self._time: float = 0.0

    def add_task(self, task: Task) -> None:
        """Add task. Testable."""
        self._tasks.append(task)

    def clear(self) -> None:
        """Clear tasks. Testable."""
        self._tasks.clear()
        self._time = 0.0

    def schedule(self) -> list[Slot]:
        """
        Schedule tasks: sort by priority (desc), assign sequential slots.
        Returns list of Slot. Testable.
        """
        ordered = sorted(self._tasks, key=lambda t: (-t.priority, t.deadline or float("inf")))
        slots: list[Slot] = []
        t = self._time
        for task in ordered:
            slots.append(Slot(start=t, end=t + task.duration, task_id=task.id))
            t += task.duration
        return slots

    def set_time(self, time: float) -> None:
        """Set current time (for scheduling start). Testable."""
        self._time = time


def create_scheduler() -> Scheduler:
    """Create empty scheduler. Testable."""
    return Scheduler()
