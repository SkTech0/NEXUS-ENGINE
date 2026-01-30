"""
Trainer — train models from data and config.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable, Iterator

from errors.error_model import ExecutionError, ValidationError

_logger = logging.getLogger("engine-ai")


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


def _validate_config(config: TrainConfig) -> None:
    if config.epochs < 0:
        raise ValidationError("epochs must be non-negative", details={"field": "epochs", "value": config.epochs})
    if config.batch_size < 1:
        raise ValidationError("batch_size must be positive", details={"field": "batch_size", "value": config.batch_size})
    if config.learning_rate < 0:
        raise ValidationError("learning_rate must be non-negative", details={"field": "learning_rate"})


class Trainer:
    """
    Trainer: set train_fn; train(data, config) returns TrainResult.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(
        self,
        train_fn: Callable[[Iterator[Any], TrainConfig], TrainResult] | None = None,
    ) -> None:
        self._train_fn = train_fn or (lambda data, cfg: TrainResult(epoch=cfg.epochs))

    def set_train_fn(self, fn: Callable[[Iterator[Any], TrainConfig], TrainResult]) -> None:
        """Set training function. Validates fn non-null."""
        if fn is None:
            raise ValidationError("train_fn is required", details={"field": "train_fn"})
        self._train_fn = fn

    def train(
        self,
        data: Iterator[Any],
        config: TrainConfig | None = None,
    ) -> TrainResult:
        """Run training. Validates config before execution."""
        config = config or TrainConfig()
        _validate_config(config)
        try:
            result = self._train_fn(data, config)
            _logger.info("trainer.train epochs=%s epoch=%s", config.epochs, result.epoch)
            return result
        except ValidationError:
            raise
        except Exception as e:
            _logger.error("trainer.train error=%s", e, exc_info=True)
            raise ExecutionError(str(e), cause=type(e).__name__, retryable=True) from e

    def train_from_list(self, data: list[Any], config: TrainConfig | None = None) -> TrainResult:
        """Train from list. Validates data non-null."""
        if data is None:
            raise ValidationError("data is required", details={"field": "data"})
        return self.train(iter(data), config)


def create_trainer(
    train_fn: Callable[[Iterator[Any], TrainConfig], TrainResult] | None = None,
) -> Trainer:
    """Create trainer. Testable."""
    return Trainer(train_fn=train_fn)
