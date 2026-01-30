"""ERL-4 enterprise hardening tests for engine-data."""
import pytest
from errors import (
    DependencyError,
    EngineError,
    ExecutionError,
    TimeoutError,
    ValidationError,
)
from errors.error_model import EngineErrorPayload
from health import HealthModel
from health.health_model import HealthResult
from observability import EnterpriseLogger
from resilience import ResiliencePolicy, with_retry
from validation import ValidationLayer, ValidationResult
from control import EngineRuntimeContext
from pipelines.data_pipeline import create_pipeline
from pipelines.observability import run_with_observability, data_corruption_detection_hook


class TestErrorModel:
    def test_validation_error(self):
        e = ValidationError("invalid input")
        assert e.code == "VALIDATION"
        assert e.type == "ValidationError"
        assert not e.retryable
        p = e.to_payload()
        assert p.code == "VALIDATION"
        assert p.message == "invalid input"

    def test_dependency_error_retryable(self):
        e = DependencyError("service unavailable")
        assert e.retryable
        assert e.to_payload().type == "DependencyError"

    def test_engine_error_payload(self):
        e = EngineError("internal", details={"key": "v"}, trace_id="t1")
        p = e.to_payload()
        assert p.trace_id == "t1"
        assert p.details == {"key": "v"}


class TestHealthModel:
    def test_liveness(self):
        h = HealthModel()
        r = h.liveness()
        assert isinstance(r, HealthResult)
        assert r.status == "healthy"
        assert r.engine_name == "engine-data"

    def test_readiness_no_checks(self):
        h = HealthModel()
        r = h.readiness()
        assert r.status == "healthy"
        assert r.checks == []

    def test_readiness_with_failing_check(self):
        def fail():
            raise RuntimeError("dep down")

        h = HealthModel(dependency_checks=[fail])
        r = h.readiness()
        assert r.status == "unhealthy"
        assert len(r.checks) == 1
        assert r.checks[0].status == "unhealthy"


class TestEnterpriseLogger:
    def test_info(self, caplog):
        import logging
        caplog.set_level(logging.INFO)
        log = EnterpriseLogger()
        log.info("op1", {"latency_ms": 10.0})
        assert "op1" in caplog.text or "ok" in caplog.text

    def test_with_trace(self):
        log = EnterpriseLogger().with_trace("trace-1", "corr-1")
        assert log._trace_id == "trace-1"
        assert log._correlation_id == "corr-1"


class TestResilience:
    def test_retry_succeeds_first_time(self):
        calls = []

        @with_retry(ResiliencePolicy().default_retry)
        def ok():
            calls.append(1)
            return 42

        assert ok() == 42
        assert len(calls) == 1

    def test_retry_retries_on_retryable(self):
        calls = []

        @with_retry(ResiliencePolicy().default_retry)
        def fail_twice():
            calls.append(1)
            if len(calls) < 2:
                raise DependencyError("temp")
            return 43

        assert fail_twice() == 43
        assert len(calls) == 2


class TestValidationLayer:
    def test_validate_input_null(self):
        v = ValidationLayer()
        r = v.validate_input("any", None)
        assert not r.valid
        assert any(i.message == "input is null" for i in r.issues)

    def test_validate_input_ok(self):
        v = ValidationLayer()
        r = v.validate_input("any", {"k": "v"})
        assert r.valid

    def test_register_validator(self):
        from validation.validation_layer import ValidationIssue

        def must_dict(a):
            if not isinstance(a, dict):
                return ValidationResult(valid=False, issues=[ValidationIssue(message="not dict")])
            return ValidationResult(valid=True)

        v = ValidationLayer()
        v.register("load", must_dict)
        r = v.validate_input("load", [])
        assert not r.valid
        r2 = v.validate_input("load", {"k": "v"})
        assert r2.valid


class TestRuntimeContext:
    def test_context(self):
        ctx = EngineRuntimeContext(trace_id="t1", correlation_id="c1", environment="prod")
        assert ctx.get_trace_id() == "t1"
        assert ctx.get_correlation_id() == "c1"
        assert ctx.is_feature_enabled("x") is False
        ctx.feature_flags["x"] = True
        assert ctx.is_feature_enabled("x") is True


class TestPipelineObservability:
    def test_run_with_observability_success(self):
        p = create_pipeline("etl").add_stage("double", lambda x: x * 2 if isinstance(x, (int, float)) else x)
        out = run_with_observability(p, 21, operation="test")
        assert out == 42

    def test_data_corruption_hook(self):
        ok, msg = data_corruption_detection_hook({"a": 1})
        assert ok is True
        ok2, msg2 = data_corruption_detection_hook("not a dict")
        assert ok2 is False
