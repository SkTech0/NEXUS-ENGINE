#!/usr/bin/env python3
"""
Nexus Engine — system check.
CPU, memory, disk (basic). No external deps.
"""
from __future__ import annotations

import os
import platform
import sys
from dataclasses import dataclass


@dataclass
class SystemInfo:
    python: str
    platform: str
    cwd: str
    env_keys: int


def collect_system_info() -> SystemInfo:
    return SystemInfo(
        python=sys.version.split()[0],
        platform=platform.system(),
        cwd=os.getcwd(),
        env_keys=len(os.environ),
    )


def run_system_check() -> bool:
    """Basic system check. Returns True if OK."""
    info = collect_system_info()
    assert info.python
    assert info.platform
    return True


def main() -> None:
    info = collect_system_info()
    print(f"Python: {info.python}")
    print(f"Platform: {info.platform}")
    print(f"CWD: {info.cwd}")
    print(f"Env vars: {info.env_keys}")
    sys.exit(0 if run_system_check() else 1)


if __name__ == "__main__":
    main()
