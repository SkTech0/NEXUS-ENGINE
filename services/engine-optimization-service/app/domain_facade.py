"""
Domain facade: wires engine-optimization domain (solvers, heuristics, schedulers,
allocators, validation) for use by the service layer.

Supports multiple optimization targets:
- loan_approval: credit/income/risk constraints → feasibility + eligibility score
- scheduling: task scheduling with priorities and deadlines
- allocation: resource allocation across consumers
- generic: objective + constraints → Optimizer with heuristic improvement

Enterprise: validation at entry, structured logging, safe bounds, error model.
"""
from __future__ import annotations

import logging
import math
import os
from pathlib import Path
from typing import Any

# Bootstrap path so engine-optimization domain is importable.
# Works in repo layout (services/engine-optimization-service/app/) and Docker (/app/app/).
_resolved = Path(__file__).resolve()
_candidates = [
    _resolved.parents[3] / "engine-optimization" if len(_resolved.parents) > 3 else None,
    Path("/app/engine-optimization"),  # Docker when engine-optimization is copied to /app
    Path(os.environ.get("ENGINE_OPTIMIZATION_PATH", "/__none__")),
]
_engine_opt_root: Path | None = None
for _p in _candidates:
    if _p and _p.exists() and (_p / "solvers").exists():
        _engine_opt_root = _p
        break
if _engine_opt_root:
    import sys
    if str(_engine_opt_root) not in sys.path:
        sys.path.insert(0, str(_engine_opt_root))

_logger = logging.getLogger("engine-optimization-service")

# Loan approval policy thresholds (configurable via env in production)
_LOAN_CREDIT_MIN = float(os.environ.get("LOAN_CREDIT_MIN", "600"))
_LOAN_INCOME_TO_LOAN_MAX = float(os.environ.get("LOAN_INCOME_TO_LOAN_MAX", "0.4"))
_LOAN_EXISTING_LOANS_MAX = int(os.environ.get("LOAN_EXISTING_LOANS_MAX", "5"))
_SCHEDULER_MAX_JOBS = int(os.environ.get("SCHEDULER_MAX_JOBS", "10000"))


def _ensure_engine() -> "OptimizationEngineContext":
    if _engine_context is None:
        raise RuntimeError(
            "Optimization engine not initialized; call init_optimization_engine() at startup"
        )
    return _engine_context


def init_optimization_engine() -> None:
    """
    Initialize domain engines: optimizer, heuristics, scheduler, allocator, validation.
    Idempotent; safe to call from lifecycle startup.
    """
    global _engine_context
    if _engine_context is not None:
        return
    if _engine_opt_root is None:
        _logger.warning(
            "engine-optimization domain not on path; optimization operations will use fallback"
        )
        _engine_context = _create_fallback_context()
        return
    try:
        from solvers.optimizer import Optimizer, OptimizationResult, create_optimizer
        from heuristics.heuristic_engine import HeuristicEngine, HeuristicResult, create_heuristic_engine
        from schedulers.scheduler import Scheduler, Task, Slot, create_scheduler
        from allocators.resource_allocator import (
            ResourceAllocator,
            Resource,
            Allocation,
            create_resource_allocator,
        )
        from validation.validation_layer import ValidationLayer, ValidationResult, ValidationIssue
        from validation.constraint_validation import (
            safe_optimization_bounds,
            scheduler_safety_check,
        )
    except ImportError as e:
        _logger.warning("engine-optimization domain import failed: %s; using fallback", e)
        _engine_context = _create_fallback_context()
        return

    validation_layer = ValidationLayer()

    def validate_optimize_input(payload: Any) -> ValidationResult:
        if payload is None:
            return ValidationResult(
                valid=False, issues=[ValidationIssue(message="payload is null", code="NULL_INPUT")]
            )
        if not isinstance(payload, dict):
            return ValidationResult(
                valid=False,
                issues=[ValidationIssue(message="payload must be a dict", code="INVALID_TYPE")],
            )
        return ValidationResult(valid=True)

    validation_layer.register("optimize", validate_optimize_input)

    class OptimizationEngineContext:
        def __init__(
            self,
            optimizer_factory: Any,
            heuristic_factory: Any,
            scheduler_factory: Any,
            allocator_factory: Any,
            validation_layer: ValidationLayer,
        ):
            self._optimizer_factory = optimizer_factory
            self._heuristic_factory = heuristic_factory
            self._scheduler_factory = scheduler_factory
            self._allocator_factory = allocator_factory
            self.validation_layer = validation_layer

        def optimize(
            self, target_id: str, objective: str, constraints: dict[str, Any]
        ) -> tuple[float, bool]:
            """
            Run optimization for the given target. Returns (value, feasible).
            """
            # Loan approval: domain-specific scoring
            if target_id and "loan" in target_id.lower():
                return self._optimize_loan_approval(constraints)

            # Scheduling: use scheduler if constraints describe tasks
            if target_id and "sched" in target_id.lower():
                return self._optimize_scheduling(constraints)

            # Allocation: use resource allocator if constraints describe resources/demands
            if target_id and "alloc" in target_id.lower():
                return self._optimize_allocation(constraints)

            # Generic: use Optimizer + heuristics
            return self._optimize_generic(objective, constraints)

        def _optimize_loan_approval(self, constraints: dict[str, Any]) -> tuple[float, bool]:
            """Loan approval: feasibility from policy thresholds; score from weighted factors."""
            credit = _to_float(constraints.get("creditScore"), 0.0)
            income_to_loan = _to_float(constraints.get("incomeToLoan"), 1.0)
            existing_loans = _to_int(constraints.get("existingLoans"), 0)

            feasible = (
                credit >= _LOAN_CREDIT_MIN
                and income_to_loan <= _LOAN_INCOME_TO_LOAN_MAX
                and existing_loans <= _LOAN_EXISTING_LOANS_MAX
            )

            # Score: 0-1 eligibility (higher = better)
            score = 0.0
            if credit >= 750:
                score += 0.4
            elif credit >= 650:
                score += 0.3
            elif credit >= _LOAN_CREDIT_MIN:
                score += 0.2
            if income_to_loan <= 0.25:
                score += 0.3
            elif income_to_loan <= _LOAN_INCOME_TO_LOAN_MAX:
                score += 0.2
            if existing_loans <= 2:
                score += 0.2
            elif existing_loans <= _LOAN_EXISTING_LOANS_MAX:
                score += 0.1
            value = min(1.0, score)
            _logger.info(
                "optimize loan_approval credit=%s income_to_loan=%s existing=%s feasible=%s value=%s",
                credit,
                income_to_loan,
                existing_loans,
                feasible,
                value,
            )
            return (value, feasible)

        def _optimize_scheduling(self, constraints: dict[str, Any]) -> tuple[float, bool]:
            """Use scheduler for task scheduling."""
            scheduler = create_scheduler()
            tasks_data = constraints.get("tasks")
            if isinstance(tasks_data, list):
                job_count = len(tasks_data)
                if not scheduler_safety_check(job_count, _SCHEDULER_MAX_JOBS):
                    _logger.warning("scheduler job_count=%s exceeds limit", job_count)
                    return (0.0, False)
                for i, t in enumerate(tasks_data):
                    if isinstance(t, dict):
                        task_id = str(t.get("id", f"task_{i}"))
                        duration = _to_float(t.get("duration"), 1.0)
                        priority = _to_int(t.get("priority"), 0)
                        deadline = t.get("deadline")
                        if isinstance(deadline, (int, float)):
                            dl = float(deadline)
                        else:
                            dl = None
                        scheduler.add_task(
                            Task(id=task_id, duration=duration, priority=priority, deadline=dl)
                        )
            slots = scheduler.schedule()
            value = len(slots)  # number of scheduled slots
            feasible = value > 0
            _logger.info("optimize scheduling tasks=%s slots=%s", len(tasks_data) if tasks_data else 0, len(slots))
            return (float(value), feasible)

        def _optimize_allocation(self, constraints: dict[str, Any]) -> tuple[float, bool]:
            """Use resource allocator."""
            allocator = create_resource_allocator()
            resources_data = constraints.get("resources")
            demands_data = constraints.get("demands")
            if isinstance(resources_data, list):
                for r in resources_data:
                    if isinstance(r, dict):
                        rid = str(r.get("id", ""))
                        cap = _to_float(r.get("capacity"), 0.0)
                        if rid:
                            allocator.add_resource(Resource(id=rid, capacity=cap))
            if isinstance(demands_data, dict):
                for consumer_id, amounts in demands_data.items():
                    if isinstance(amounts, dict):
                        allocator.set_demand(str(consumer_id), {k: _to_float(v, 0) for k, v in amounts.items()})
            allocations = allocator.allocate()
            total_allocated = sum(
                sum(a.amounts.values()) for a in allocations
            )
            feasible = len(allocations) > 0
            _logger.info("optimize allocation consumers=%s total_allocated=%s", len(allocations), total_allocated)
            return (total_allocated, feasible)

        def _optimize_generic(self, objective: str, constraints: dict[str, Any]) -> tuple[float, bool]:
            """Generic: build objective and constraints, run Optimizer + optional heuristics."""
            minimize = "min" in (objective or "").lower() or "minimize" in (objective or "").lower()

            def obj_fn(x: float) -> float:
                return x

            optimizer = create_optimizer(objective=obj_fn, minimize=minimize)

            def constr_credit(s: float) -> bool:
                c = _to_float(constraints.get("creditScore"), 0)
                return c >= _LOAN_CREDIT_MIN if c > 0 else True

            def constr_income_loan(s: float) -> bool:
                itl = _to_float(constraints.get("incomeToLoan"), 0)
                return itl <= _LOAN_INCOME_TO_LOAN_MAX if itl >= 0 else True

            if "creditScore" in constraints:
                optimizer.add_constraint(constr_credit)
            if "incomeToLoan" in constraints:
                optimizer.add_constraint(constr_income_loan)

            initial = _to_float(constraints.get("initial", constraints.get("x", 0.5)), 0.5)
            result = optimizer.solve(initial)

            value = result.value
            if not safe_optimization_bounds(lower=0.0, upper=1.0, value=value):
                value = max(0.0, min(1.0, value))
            _logger.info("optimize generic objective=%s feasible=%s value=%s", objective, result.feasible, value)
            return (value, result.feasible)

    _engine_context = OptimizationEngineContext(
        optimizer_factory=create_optimizer,
        heuristic_factory=create_heuristic_engine,
        scheduler_factory=create_scheduler,
        allocator_factory=create_resource_allocator,
        validation_layer=validation_layer,
    )
    _logger.info("domain_facade.init_optimization_engine ready (engine-optimization domain)")


def _create_fallback_context() -> "OptimizationEngineContext":
    """Fallback when engine-optimization domain is unavailable."""

    class FakeValidationResult:
        valid = True
        issues: list = []

    class FakeValidationLayer:
        def validate_input(self, op: str, payload: Any) -> FakeValidationResult:
            return FakeValidationResult()

    class FallbackContext:
        validation_layer = FakeValidationLayer()

        def optimize(
            self, target_id: str, objective: str, constraints: dict[str, Any]
        ) -> tuple[float, bool]:
            # Minimal deterministic fallback
            n = len(constraints) if isinstance(constraints, dict) else 0
            value = min(1.0, 0.5 + n * 0.1)
            feasible = True
            _logger.warning("optimize fallback target_id=%s value=%s", target_id, value)
            return (value, feasible)

    return FallbackContext()


def _to_float(v: Any, default: float) -> float:
    if v is None:
        return default
    try:
        return float(v)
    except (TypeError, ValueError):
        return default


def _to_int(v: Any, default: int) -> int:
    if v is None:
        return default
    try:
        return int(v)
    except (TypeError, ValueError):
        return default


_engine_context: "OptimizationEngineContext | None" = None


def optimize(
    target_id: str, objective: str, constraints: dict[str, Any]
) -> dict[str, Any]:
    """
    Domain entrypoint: run optimization and return { targetId, value, feasible }.
    """
    ctx = _ensure_engine()
    result = ctx.validation_layer.validate_input(
        "optimize",
        {"targetId": target_id, "objective": objective, "constraints": constraints},
    )
    if not result.valid:
        issues = [f"{getattr(i, 'path', 'payload') or 'payload'}: {getattr(i, 'message', str(i))}" for i in getattr(result, "issues", [])]
        try:
            from errors.error_model import ValidationError
            raise ValidationError("Optimization validation failed", details={"issues": issues})
        except ImportError:
            raise ValueError(f"Optimization validation failed: {issues}")

    value, feasible = ctx.optimize(
        target_id or "default",
        objective or "",
        constraints if isinstance(constraints, dict) else {},
    )
    return {
        "targetId": target_id or "default",
        "value": round(value, 6),
        "feasible": feasible,
    }
