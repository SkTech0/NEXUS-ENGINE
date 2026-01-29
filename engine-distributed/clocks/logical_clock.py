"""
Lamport logical clock — single counter for causal ordering.
Modular, testable.
"""
from dataclasses import dataclass


@dataclass
class LogicalClock:
    """Lamport logical clock."""

    value: int = 0

    def tick(self) -> int:
        """Increment and return new value. Testable."""
        self.value += 1
        return self.value

    def get(self) -> int:
        """Return current value without incrementing."""
        return self.value

    def receive(self, message_timestamp: int) -> int:
        """Update clock on receive: max(local, message) + 1. Returns new value."""
        self.value = max(self.value, message_timestamp) + 1
        return self.value


def create_logical_clock(initial: int = 0) -> LogicalClock:
    """Create a logical clock. Testable."""
    return LogicalClock(value=initial)


def send_timestamp(clock: LogicalClock) -> int:
    """Increment on send and return timestamp to attach to message."""
    return clock.tick()


def receive_timestamp(clock: LogicalClock, message_ts: int) -> int:
    """Update clock when receiving a message. Returns new local time."""
    return clock.receive(message_ts)
