"""
Message bus — in-memory pub/sub for testing; replace with Redis/Rabbit in production.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class Message:
    """A published message."""

    topic: str
    payload: Any


Handler = Callable[[Message], None]


class MessageBus:
    """
    In-memory message bus: subscribe by topic, publish to topic.
    Testable.
    """

    def __init__(self) -> None:
        self._handlers: dict[str, list[Handler]] = {}
        self._history: list[Message] = []

    def subscribe(self, topic: str, handler: Handler) -> None:
        """Subscribe to topic. Testable."""
        if topic not in self._handlers:
            self._handlers[topic] = []
        self._handlers[topic].append(handler)

    def unsubscribe(self, topic: str, handler: Handler) -> bool:
        """Remove handler from topic. Returns True if removed. Testable."""
        if topic not in self._handlers:
            return False
        try:
            self._handlers[topic].remove(handler)
            return True
        except ValueError:
            return False

    def publish(self, topic: str, payload: Any) -> None:
        """Publish message to topic; notify all subscribers. Testable."""
        msg = Message(topic=topic, payload=payload)
        self._history.append(msg)
        for h in self._handlers.get(topic, []):
            h(msg)

    def get_messages(self, topic: str | None = None) -> list[Message]:
        """Return message history, optionally filtered by topic. Testable."""
        if topic is None:
            return list(self._history)
        return [m for m in self._history if m.topic == topic]

    def clear_history(self) -> None:
        """Clear message history (for tests). Testable."""
        self._history.clear()

    def topics(self) -> list[str]:
        """Return all topics that have subscribers. Testable."""
        return list(self._handlers.keys())


def create_message_bus() -> MessageBus:
    """Create a new message bus. Testable."""
    return MessageBus()
