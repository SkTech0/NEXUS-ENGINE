"""
Scheduler — schedule tasks on resources with optional priorities and deadlines.
Enterprise: validation, logging, clear errors (ERL-4).
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-optimization")


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
    Enterprise: input validation, structured logging, safe errors.
    """

    def __init__(self) -> None:
        self._tasks: list[Task] = []
        self._time: float = 0.0

    def add_task(self, task: Task) -> None:
        """Add task. Validates task id and duration."""
        if not (task.id or "").strip():
            raise ValidationError("task id is required", details={"field": "id"})
        if task.duration < 0:
            raise ValidationError("task duration must be non-negative", details={"field": "duration", "value": task.duration})
        self._tasks.append(task)
        _logger.debug("scheduler.add_task id=%s duration=%s", task.id, task.duration)

    def clear(self) -> None:
        """Clear tasks."""
        self._tasks.clear()
        self._time = 0.0
        _logger.debug("scheduler.clear")

    def schedule(self) -> list[Slot]:
        """
        Schedule tasks: sort by priority (desc), assign sequential slots.
        Returns list of Slot. Logs slot count.
        """
        ordered = sorted(self._tasks, key=lambda t: (-t.priority, t.deadline or float("inf")))
        slots: list[Slot] = []
        t = self._time
        for task in ordered:
            slots.append(Slot(start=t, end=t + task.duration, task_id=task.id))
            t += task.duration
        _logger.info("scheduler.schedule tasks=%s slots=%s", len(self._tasks), len(slots))
        return slots

    def set_time(self, time: float) -> None:
        """Set current time (for scheduling start). Testable."""
        self._time = time


def create_scheduler() -> Scheduler:
    """Create empty scheduler. Testable."""
    return Scheduler()
