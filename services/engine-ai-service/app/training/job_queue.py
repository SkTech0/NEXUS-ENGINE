"""
Training job queue — async job submission, status polling, in-memory store.

Enterprise: thread-safe, extensible to Redis/Celery. Jobs run in background thread.
"""
from __future__ import annotations

import logging
import threading
import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable

_logger = logging.getLogger("engine-ai-service.training")


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class TrainingJob:
    job_id: str
    status: JobStatus = JobStatus.PENDING
    created_at: float = field(default_factory=time.time)
    started_at: float | None = None
    completed_at: float | None = None
    config: dict[str, Any] = field(default_factory=dict)
    result_path: str | None = None
    error: str | None = None
    progress: float = 0.0  # 0.0 - 1.0


class TrainingJobQueue:
    """Thread-safe in-memory job queue. Extensible to Redis for production."""

    def __init__(self) -> None:
        self._jobs: dict[str, TrainingJob] = {}
        self._lock = threading.RLock()

    def submit(self, config: dict[str, Any] | None = None) -> str:
        """Create and enqueue a training job. Returns job_id."""
        job_id = str(uuid.uuid4())
        with self._lock:
            job = TrainingJob(job_id=job_id, config=config or {})
            self._jobs[job_id] = job
        _logger.info("training job submitted job_id=%s", job_id)
        return job_id

    def get(self, job_id: str) -> TrainingJob | None:
        with self._lock:
            return self._jobs.get(job_id)

    def get_status(self, job_id: str) -> dict[str, Any]:
        job = self.get(job_id)
        if job is None:
            return {"jobId": job_id, "status": "not_found", "message": "Job not found"}
        return {
            "jobId": job.job_id,
            "status": job.status.value,
            "createdAt": job.created_at,
            "startedAt": job.started_at,
            "completedAt": job.completed_at,
            "progress": job.progress,
            "resultPath": job.result_path,
            "error": job.error,
        }

    def start(self, job_id: str) -> bool:
        with self._lock:
            job = self._jobs.get(job_id)
            if not job or job.status != JobStatus.PENDING:
                return False
            job.status = JobStatus.RUNNING
            job.started_at = time.time()
        return True

    def complete(self, job_id: str, result_path: str | None = None) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job:
                job.status = JobStatus.COMPLETED
                job.completed_at = time.time()
                job.progress = 1.0
                job.result_path = result_path

    def fail(self, job_id: str, error: str) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job:
                job.status = JobStatus.FAILED
                job.completed_at = time.time()
                job.error = error

    def update_progress(self, job_id: str, progress: float) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job:
                job.progress = min(1.0, max(0.0, progress))


_job_queue: TrainingJobQueue | None = None
_queue_lock = threading.Lock()


def get_job_queue() -> TrainingJobQueue:
    global _job_queue
    with _queue_lock:
        if _job_queue is None:
            _job_queue = TrainingJobQueue()
        return _job_queue
