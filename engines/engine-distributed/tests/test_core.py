"""Core unit tests for engine-distributed."""
import pytest
from messaging.message_bus import MessageBus, Message, create_message_bus
from state.distributed_state import create_distributed_state


class TestMessageBus:
    def test_create(self):
        bus = create_message_bus()
        assert bus is not None

    def test_publish_subscribe(self):
        bus = create_message_bus()
        seen = []
        bus.subscribe("topic", lambda m: seen.append(m))
        bus.publish("topic", "payload")
        assert len(seen) == 1
        assert seen[0].topic == "topic"
        assert seen[0].payload == "payload"

    def test_get_messages(self):
        bus = create_message_bus()
        bus.publish("a", 1)
        bus.publish("a", 2)
        msgs = bus.get_messages("a")
        assert len(msgs) == 2


class TestDistributedState:
    def test_create(self):
        st = create_distributed_state()
        assert st is not None

    def test_set_get(self):
        st = create_distributed_state()
        st.set("k", "v")
        assert st.get("k") == "v"

    def test_delete(self):
        st = create_distributed_state()
        st.set("k", "v")
        assert st.delete("k") is True
        assert st.get("k") is None
        assert st.delete("k") is False
