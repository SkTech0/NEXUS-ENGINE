"""
Training runner — executes train_and_save in background subprocess.

Uses subprocess to avoid sklearn/module import deadlocks when running in threads.
"""
from __future__ import annotations

import logging
import subprocess
import sys
from pathlib import Path

from .job_queue import get_job_queue

_logger = logging.getLogger("engine-ai-service.training")


def run_training_job(job_id: str, config: dict) -> None:
    """Run training in background subprocess. Updates job status on completion/failure."""
    queue = get_job_queue()
    if not queue.start(job_id):
        return
    models_dir = Path(__file__).resolve().parent.parent / "models"
    try:
        result = subprocess.run(
            [sys.executable, "-m", "app.models.train", "--output-dir", str(models_dir)],
            cwd=Path(__file__).resolve().parent.parent.parent,
            capture_output=True,
            text=True,
            timeout=300,
        )
        if result.returncode == 0 and result.stdout.strip():
            # Parse "Model saved to /path" from stdout
            for line in result.stdout.strip().split("\n"):
                if "saved to" in line.lower():
                    path = line.split("saved to")[-1].strip()
                    queue.complete(job_id, result_path=path)
                    break
            else:
                queue.complete(job_id, result_path=str(models_dir / "risk_model.joblib"))
            _logger.info("training completed job_id=%s", job_id)
        else:
            err = result.stderr or result.stdout or f"exit code {result.returncode}"
            queue.fail(job_id, err[:500])
            _logger.warning("training failed job_id=%s: %s", job_id, err[:200])
    except subprocess.TimeoutExpired:
        queue.fail(job_id, "Training timed out after 300s")
        _logger.warning("training timeout job_id=%s", job_id)
    except Exception as e:
        _logger.exception("training failed job_id=%s", job_id)
        queue.fail(job_id, str(e))
