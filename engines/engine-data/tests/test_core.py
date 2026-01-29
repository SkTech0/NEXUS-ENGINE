"""Core unit tests for engine-data."""
import pytest
from pipelines.data_pipeline import DataPipeline, create_pipeline, PipelineStage, map_stage


class TestDataPipeline:
    def test_create(self):
        p = create_pipeline("test")
        assert p.name == "test"
        assert p.stages() == []

    def test_add_stage(self):
        p = create_pipeline().add_stage("map", lambda x: x * 2)
        assert p.stages() == ["map"]

    def test_run(self):
        p = create_pipeline().add_stage("a", lambda x: x + 1).add_stage("b", lambda x: x * 2)
        assert p.run(3) == 8


class TestPipelineStage:
    def test_map_stage(self):
        s = map_stage("double", lambda x: x * 2)
        assert s.name == "double"
        assert s.run(5) == 10
