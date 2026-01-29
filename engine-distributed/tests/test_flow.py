"""Flow tests for engine-distributed."""
import pytest
from messaging.message_bus import create_message_bus
from state.distributed_state import create_distributed_state


class TestDistributedFlow:
    def test_pub_sub_state_flow(self):
        bus = create_message_bus()
        state = create_distributed_state()

        def handler(m):
            state.set(f"last_{m.topic}", m.payload)

        bus.subscribe("cmd", handler)
        bus.publish("cmd", {"action": "start"})
        bus.publish("cmd", {"action": "stop"})
        assert state.get("last_cmd") == {"action": "stop"}
        assert len(bus.get_messages("cmd")) == 2
