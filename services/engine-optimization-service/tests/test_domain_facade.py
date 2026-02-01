"""Integration tests for engine-optimization-service domain facade."""
import sys
from pathlib import Path

# Ensure service dir and engine-optimization are on path
_service_dir = Path(__file__).resolve().parents[1]
_root = _service_dir.parents[1]
if str(_service_dir) not in sys.path:
    sys.path.insert(0, str(_service_dir))
_engine_opt = _root / "engine-optimization"
if _engine_opt.exists() and str(_engine_opt) not in sys.path:
    sys.path.insert(0, str(_engine_opt))

import pytest


class TestOptimizationFacade:
    """Test domain_facade optimize() with engine-optimization domain."""

    def test_loan_approval_feasible_high_credit(self):
        from app.domain_facade import init_optimization_engine, optimize
        init_optimization_engine()
        result = optimize(
            target_id="loan_approval",
            objective="maximize",
            constraints={
                "creditScore": 750,
                "incomeToLoan": 0.3,
                "existingLoans": 1,
            },
        )
        assert result["feasible"] is True
        assert result["value"] >= 0.5
        assert result["targetId"] == "loan_approval"

    def test_loan_approval_infeasible_low_credit(self):
        from app.domain_facade import init_optimization_engine, optimize
        init_optimization_engine()
        result = optimize(
            target_id="loan_approval",
            objective="maximize",
            constraints={"creditScore": 500, "incomeToLoan": 0.5, "existingLoans": 3},
        )
        assert result["feasible"] is False
        assert result["targetId"] == "loan_approval"

    def test_scheduling_target(self):
        from app.domain_facade import init_optimization_engine, optimize
        init_optimization_engine()
        result = optimize(
            target_id="scheduling",
            objective="",
            constraints={
                "tasks": [
                    {"id": "t1", "duration": 2.0, "priority": 1},
                    {"id": "t2", "duration": 1.0, "priority": 2},
                ]
            },
        )
        assert result["feasible"] is True
        assert result["value"] == 2.0  # 2 slots

    def test_allocation_target(self):
        from app.domain_facade import init_optimization_engine, optimize
        init_optimization_engine()
        result = optimize(
            target_id="allocation",
            objective="",
            constraints={
                "resources": [{"id": "r1", "capacity": 100}],
                "demands": {"c1": {"r1": 60}, "c2": {"r1": 40}},
            },
        )
        assert result["feasible"] is True
        assert result["value"] == 100.0  # total allocated
