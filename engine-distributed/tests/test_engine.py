"""Engine-level tests for engine-distributed."""
import pytest
from messaging.message_bus import create_message_bus
from state.distributed_state import create_distributed_state


class TestDistributedEngine:
    def test_message_bus_multi_topic(self):
        bus = create_message_bus()
        a_msgs = []
        b_msgs = []
        bus.subscribe("a", lambda m: a_msgs.append(m))
        bus.subscribe("b", lambda m: b_msgs.append(m))
        bus.publish("a", 1)
        bus.publish("b", 2)
        bus.publish("a", 3)
        assert len(a_msgs) == 2
        assert len(b_msgs) == 1

    def test_state_merge_scalar(self):
        st = create_distributed_state()
        st.set("k", "v1", version=1)
        st.merge_scalar("k", "v2", 2)
        assert st.get("k") == "v2"
