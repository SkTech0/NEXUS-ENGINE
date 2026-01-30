"""
Engine AI — Model health (ERL-4).
Model existence checks, health for readiness.
"""
from __future__ import annotations

from typing import Callable

from models.model_manager import ModelManager


def model_health_check(manager: ModelManager) -> bool:
    """
    Health check: manager has at least one model or is empty but operational.
    Use as dependency check for HealthModel readiness.
    """
    try:
        _ = manager.list_models()
        return True
    except Exception:
        return False


def create_model_health_check(manager: ModelManager) -> Callable[[], bool]:
    """Return a callable for HealthModel.add_dependency_check."""
    return lambda: model_health_check(manager)
