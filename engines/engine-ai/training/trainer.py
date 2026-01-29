"""
Trainer — train models from data and config.
Modular, testable; abstract training loop.
"""
from dataclasses import dataclass, field
from typing import Any, Callable, Iterator


@dataclass
class TrainConfig:
    """Training config: epochs, batch size, etc."""

    epochs: int = 1
    batch_size: int = 32
    learning_rate: float = 0.001
    extra: dict[str, Any] = field(default_factory=dict)


@dataclass
class TrainResult:
    """Result: model payload, metrics, epoch."""

    model: Any = None
    metrics: dict[str, float] = field(default_factory=dict)
    epoch: int = 0


class Trainer:
    """
    Trainer: set train_fn; train(data, config) returns TrainResult.
    Testable.
    """

    def __init__(
        self,
        train_fn: Callable[[Iterator[Any], TrainConfig], TrainResult] | None = None,
    ) -> None:
        self._train_fn = train_fn or (lambda data, cfg: TrainResult(epoch=cfg.epochs))

    def set_train_fn(self, fn: Callable[[Iterator[Any], TrainConfig], TrainResult]) -> None:
        """Set training function. Testable."""
        self._train_fn = fn

    def train(
        self,
        data: Iterator[Any],
        config: TrainConfig | None = None,
    ) -> TrainResult:
        """Run training. Testable."""
        config = config or TrainConfig()
        return self._train_fn(data, config)

    def train_from_list(self, data: list[Any], config: TrainConfig | None = None) -> TrainResult:
        """Train from list (convenience). Testable."""
        return self.train(iter(data), config)


def create_trainer(
    train_fn: Callable[[Iterator[Any], TrainConfig], TrainResult] | None = None,
) -> Trainer:
    """Create trainer. Testable."""
    return Trainer(train_fn=train_fn)
