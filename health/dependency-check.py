#!/usr/bin/env python3
"""
Nexus Engine — dependency check.
Verify engine-api, optionally npm/node, dotnet.
"""
from __future__ import annotations

import os
import subprocess
import sys
from typing import Optional


def check_engine_api() -> bool:
    try:
        import urllib.request
        base = os.environ.get("ENGINE_API_URL", "http://localhost:5000")
        url = f"{base.rstrip('/')}/api/Health"
        with urllib.request.urlopen(url, timeout=5) as r:
            return r.getcode() == 200
    except Exception:
        return False


def check_node() -> bool:
    try:
        subprocess.run(
            ["node", "--version"],
            capture_output=True,
            timeout=5,
            check=True,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
        return False


def check_dotnet() -> bool:
    try:
        subprocess.run(
            ["dotnet", "--version"],
            capture_output=True,
            timeout=5,
            check=True,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
        return False


def run_dependency_check(skip_api: bool = False) -> bool:
    ok = True
    if not skip_api and not check_engine_api():
        print("  engine-api: FAIL (unreachable)")
        ok = False
    elif not skip_api:
        print("  engine-api: OK")
    if not check_node():
        print("  node: FAIL (not found)")
        ok = False
    else:
        print("  node: OK")
    if not check_dotnet():
        print("  dotnet: FAIL (not found)")
        ok = False
    else:
        print("  dotnet: OK")
    return ok


def main() -> None:
    skip_api = os.environ.get("SKIP_ENGINE_API_CHECK", "").lower() in ("1", "true", "yes")
    print("Dependency check:")
    sys.exit(0 if run_dependency_check(skip_api=skip_api) else 1)


if __name__ == "__main__":
    main()
