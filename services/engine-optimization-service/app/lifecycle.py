"""Startup/shutdown lifecycle for engine-optimization-service."""
from typing import Callable, List

_startup_hooks: List[Callable[[], None]] = []
_shutdown_hooks: List[Callable[[], None]] = []


def on_startup(fn: Callable[[], None]) -> None:
    _startup_hooks.append(fn)


def on_shutdown(fn: Callable[[], None]) -> None:
    _shutdown_hooks.append(fn)


def _startup_optimization_engine() -> None:
    import logging
    try:
        from app.domain_facade import init_optimization_engine
        init_optimization_engine()
    except Exception as e:
        logging.getLogger("engine-optimization-service").warning(
            "optimization engine init failed; health will work, optimize will use fallback. %s",
            e,
            exc_info=True,
        )


on_startup(_startup_optimization_engine)


async def run_startup() -> None:
    for fn in _startup_hooks:
        fn()


async def run_shutdown() -> None:
    for fn in reversed(_shutdown_hooks):
        fn()
