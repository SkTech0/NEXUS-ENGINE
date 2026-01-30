"""Startup/shutdown lifecycle for engine-trust-service."""
from typing import Callable, List

_startup_hooks: List[Callable[[], None]] = []
_shutdown_hooks: List[Callable[[], None]] = []


def on_startup(fn: Callable[[], None]) -> None:
    _startup_hooks.append(fn)


def on_shutdown(fn: Callable[[], None]) -> None:
    _shutdown_hooks.append(fn)


async def run_startup() -> None:
    for fn in _startup_hooks:
        fn()


async def run_shutdown() -> None:
    for fn in reversed(_shutdown_hooks):
        fn()
