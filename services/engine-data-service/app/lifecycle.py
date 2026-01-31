"""Startup/shutdown lifecycle for engine-data-service."""
from typing import Callable, List

_startup_hooks: List[Callable[[], None]] = []
_shutdown_hooks: List[Callable[[], None]] = []


def on_startup(fn: Callable[[], None]) -> None:
    _startup_hooks.append(fn)


def on_shutdown(fn: Callable[[], None]) -> None:
    _shutdown_hooks.append(fn)


def _startup_data_engine() -> None:
    from app.domain_facade import init_engine
    init_engine()


on_startup(_startup_data_engine)


async def run_startup() -> None:
    for fn in _startup_hooks:
        fn()


async def run_shutdown() -> None:
    for fn in reversed(_shutdown_hooks):
        fn()
