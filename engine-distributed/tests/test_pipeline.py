"""Pipeline-style tests for engine-distributed."""
import pytest
from messaging.message_bus import create_message_bus
from state.distributed_state import create_distributed_state


class TestDistributedPipeline:
    def test_bus_then_state_flow(self):
        bus = create_message_bus()
        state = create_distributed_state()
        received = []

        def on_msg(m):
            received.append(m)
            state.set(m.topic, m.payload)

        bus.subscribe("events", on_msg)
        bus.publish("events", {"id": 1})
        assert len(received) == 1
        assert state.get("events") == {"id": 1}
