"""
Nexus Engine - Config Loader (scaffolding, additive only)

Goals:
- Centralized config resolution across JSON/YAML env packs.
- Strict precedence model: defaults → env → secrets → runtime.
- Secrets injection patterns for Vault / Azure Key Vault / AWS Secrets Manager.

Important:
- This module is NOT wired into runtime by default. It is safe scaffolding.
- No secrets should be checked into the repo; only env-var references and prefixes.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Mapping, Optional, Protocol


class SecretsProvider(Protocol):
    """Interface for runtime secrets resolution."""

    def resolve(self, key: str) -> Optional[str]:
        """Return secret value for `key`, or None if not found."""


def _deep_merge(base: Dict[str, Any], overlay: Mapping[str, Any]) -> Dict[str, Any]:
    """Deep-merge overlay into base (overlay wins)."""
    for k, v in overlay.items():
        if isinstance(v, Mapping) and isinstance(base.get(k), dict):
            base[k] = _deep_merge(base[k], v)
        else:
            base[k] = v
    return base


def _load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _load_yaml(path: Path) -> Dict[str, Any]:
    """
    YAML loader.

    Dependency note:
    - Uses PyYAML if available. If not installed, raise a clear error.
    """
    try:
        import yaml  # type: ignore
    except Exception as e:  # pragma: no cover
        raise RuntimeError(
            "YAML support requires PyYAML. Install with `pip install pyyaml` "
            "or replace this loader with your organization-standard YAML parser."
        ) from e

    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
        if not isinstance(data, dict):
            raise ValueError(f"Expected mapping at root of YAML: {path}")
        return data


def _envvar_expand(value: Any) -> Any:
    """
    Expand placeholders in leaf strings.

    Supported patterns:
    - ${VAR_NAME}
    - OVERRIDE_WITH_ENVVAR_<VAR_NAME>  (legacy placeholder style)
    """
    if isinstance(value, str):
        if value.startswith("OVERRIDE_WITH_ENVVAR_"):
            var = value.replace("OVERRIDE_WITH_ENVVAR_", "", 1)
            return os.getenv(var, value)
        if "${" in value and "}" in value:
            # Minimal expansion for ${VAR}; leaves unknown vars intact.
            out = value
            while "${" in out:
                start = out.find("${")
                end = out.find("}", start + 2)
                if end == -1:
                    break
                var = out[start + 2 : end]
                out = out[:start] + os.getenv(var, f"${{{var}}}") + out[end + 1 :]
            return out
        return value
    if isinstance(value, dict):
        return {k: _envvar_expand(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_envvar_expand(v) for v in value]
    return value


def _set_by_dotted_path(doc: Dict[str, Any], dotted: str, value: Any) -> None:
    parts = dotted.split(".")
    cur: Any = doc
    for p in parts[:-1]:
        if p not in cur or not isinstance(cur[p], dict):
            cur[p] = {}
        cur = cur[p]
    cur[parts[-1]] = value


@dataclass(frozen=True)
class ConfigPaths:
    repo_root: Path

    def env_dir(self, env: str) -> Path:
        return self.repo_root / "env" / env


class ConfigLoader:
    """
    Central configuration resolver.

    Resolution model:
      1) defaults (optional input)
      2) env pack (env/<env>/...)
      3) secrets injection (optional provider)
      4) runtime overrides (env vars / explicit overrides dict)
    """

    def __init__(self, repo_root: Path) -> None:
        self.paths = ConfigPaths(repo_root=repo_root)

    def load(
        self,
        env: str,
        *,
        defaults: Optional[Mapping[str, Any]] = None,
        secrets_provider: Optional[SecretsProvider] = None,
        runtime_overrides: Optional[Mapping[str, Any]] = None,
    ) -> Dict[str, Any]:
        env_dir = self.paths.env_dir(env)
        if not env_dir.exists():
            raise FileNotFoundError(f"Environment pack not found: {env_dir}")

        resolved: Dict[str, Any] = {}

        # 1) defaults
        if defaults:
            _deep_merge(resolved, defaults)

        # 2) env pack documents (known filenames)
        appsettings = _load_json(env_dir / "appsettings.json")
        engine = _load_yaml(env_dir / "engine-config.yaml")
        ai = _load_yaml(env_dir / "ai-config.yaml")
        obs = _load_yaml(env_dir / "observability.yaml")
        sec = _load_yaml(env_dir / "security.yaml")
        infra = _load_yaml(env_dir / "infra.yaml")

        _deep_merge(resolved, {"appsettings": appsettings})
        _deep_merge(resolved, {"engine": engine})
        _deep_merge(resolved, {"ai": ai})
        _deep_merge(resolved, {"observability": obs})
        _deep_merge(resolved, {"security": sec})
        _deep_merge(resolved, {"infra": infra})

        # Expand env var placeholders embedded in pack docs.
        resolved = _envvar_expand(resolved)

        # 3) secrets injection (pattern scaffolding)
        if secrets_provider is not None:
            # Example: inject a resolved connection string if the placeholder remains.
            cs = (
                resolved.get("appsettings", {})
                .get("ConnectionStrings", {})
                .get("Primary")
            )
            if isinstance(cs, str) and (
                cs.startswith("OVERRIDE_WITH_ENVVAR_") or "REPLACE" in cs
            ):
                injected = secrets_provider.resolve("ConnectionStrings:Primary")
                if injected:
                    _set_by_dotted_path(resolved, "appsettings.ConnectionStrings.Primary", injected)

        # 4) runtime overrides (explicit dict: dotted paths recommended)
        if runtime_overrides:
            # If caller provides dotted keys, apply them; otherwise deep-merge dict.
            dotted_like = all(isinstance(k, str) and "." in k for k in runtime_overrides.keys())
            if dotted_like:
                for k, v in runtime_overrides.items():
                    _set_by_dotted_path(resolved, k, v)
            else:
                _deep_merge(resolved, runtime_overrides)

        return resolved


def main() -> None:  # pragma: no cover
    """
    Minimal CLI for inspection only.

    Usage:
      python config/config-loader.py --env local
    """
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--env", dest="env", required=True)
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    cfg = ConfigLoader(repo_root=repo_root).load(args.env)
    print(json.dumps(cfg, indent=2))


if __name__ == "__main__":  # pragma: no cover
    main()

