"""
Message bus — in-memory pub/sub for testing; replace with Redis/Rabbit in production.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-distributed")


@dataclass
class Message:
    """A published message."""

    topic: str
    payload: Any


Handler = Callable[[Message], None]


class MessageBus:
    """
    In-memory message bus: subscribe by topic, publish to topic.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._handlers: dict[str, list[Handler]] = {}
        self._history: list[Message] = []

    def subscribe(self, topic: str, handler: Handler) -> None:
        """Subscribe to topic. Validates topic and handler before state mutation."""
        if not (topic or "").strip():
            raise ValidationError("topic is required", details={"field": "topic"})
        if handler is None:
            raise ValidationError("handler is required", details={"field": "handler"})
        if topic not in self._handlers:
            self._handlers[topic] = []
        self._handlers[topic].append(handler)
        _logger.debug("message_bus.subscribe topic=%s", topic)

    def unsubscribe(self, topic: str, handler: Handler) -> bool:
        """Remove handler from topic. Validates topic and handler."""
        if not (topic or "").strip():
            raise ValidationError("topic is required", details={"field": "topic"})
        if handler is None:
            raise ValidationError("handler is required", details={"field": "handler"})
        if topic not in self._handlers:
            return False
        try:
            self._handlers[topic].remove(handler)
            _logger.debug("message_bus.unsubscribe topic=%s", topic)
            return True
        except ValueError:
            return False

    def publish(self, topic: str, payload: Any) -> None:
        """Publish message to topic; notify all subscribers. Validates topic non-empty."""
        if not (topic or "").strip():
            raise ValidationError("topic is required", details={"field": "topic"})
        msg = Message(topic=topic, payload=payload)
        self._history.append(msg)
        for h in self._handlers.get(topic, []):
            h(msg)
        _logger.debug("message_bus.publish topic=%s", topic)

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
