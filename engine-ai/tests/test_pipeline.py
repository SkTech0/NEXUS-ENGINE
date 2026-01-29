"""Pipeline tests for engine-ai."""
import pytest
from pipelines.ai_pipeline import AIPipeline, create_ai_pipeline


class TestAIPipeline:
    def test_create(self):
        p = create_ai_pipeline("test")
        assert p.name == "test"
        assert p.stages() == []

    def test_add_stage_chain(self):
        p = create_ai_pipeline().add_stage("a", lambda x: x + 1).add_stage("b", lambda x: x * 2)
        assert p.stages() == ["a", "b"]

    def test_run(self):
        p = create_ai_pipeline().add_stage("inc", lambda x: x + 1).add_stage("double", lambda x: x * 2)
        assert p.run(5) == 12

    def test_run_empty(self):
        p = create_ai_pipeline()
        assert p.run(42) == 42
