"""Flow tests for engine-data."""
import pytest
from pipelines.data_pipeline import create_pipeline
from caching.cache_engine import create_cache_engine


class TestDataFlow:
    def test_load_transform_store_flow(self):
        cache = create_cache_engine()
        pipe = (
            create_pipeline("flow")
            .add_stage("load", lambda _: {"ids": [1, 2, 3]})
            .add_stage("transform", lambda d: {"ids": [i * 10 for i in d["ids"]]})
            .add_stage("store", lambda d: (cache.set("result", d), d)[1])
        )
        out = pipe.run(None)
        assert out["ids"] == [10, 20, 30]
        assert cache.get("result") == out
