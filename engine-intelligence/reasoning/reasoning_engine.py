"""
Reasoning engine — logical steps and rule application.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-intelligence")


@dataclass
class Fact:
    """A fact: predicate and arguments."""

    predicate: str
    args: tuple[Any, ...] = ()

    def key(self) -> str:
        """Canonical key for equality. Testable."""
        return f"{self.predicate}({','.join(map(str, self.args))})"


@dataclass
class Rule:
    """A rule: condition -> conclusion."""

    name: str
    condition: Callable[[dict[str, Any]], bool]
    conclusion: Callable[[dict[str, Any]], Fact | None]


class ReasoningEngine:
    """
    In-memory reasoning: facts + rules; step() applies rules once.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._facts: dict[str, Fact] = {}
        self._rules: list[Rule] = []

    def add_fact(self, fact: Fact) -> None:
        """Add fact. Validates before state mutation."""
        if fact is None:
            raise ValidationError("fact is required", details={"field": "fact"})
        if not (getattr(fact, "predicate", None) or "").strip():
            raise ValidationError("fact predicate is required", details={"field": "predicate"})
        self._facts[fact.key()] = fact
        _logger.debug("reasoning_engine.add_fact key=%s", fact.key())

    def add_rule(self, rule: Rule) -> None:
        """Add rule. Validates before state mutation."""
        if rule is None:
            raise ValidationError("rule is required", details={"field": "rule"})
        if not (getattr(rule, "name", None) or "").strip():
            raise ValidationError("rule name is required", details={"field": "name"})
        if getattr(rule, "condition", None) is None or getattr(rule, "conclusion", None) is None:
            raise ValidationError("rule condition and conclusion are required", details={"field": "rule"})
        self._rules.append(rule)
        _logger.debug("reasoning_engine.add_rule name=%s", rule.name)

    def get_facts(self) -> list[Fact]:
        """All facts. Testable."""
        return list(self._facts.values())

    def get_context(self) -> dict[str, Any]:
        """Context from current facts (predicate -> list of args). Testable."""
        ctx: dict[str, list[tuple[Any, ...]]] = {}
        for f in self._facts.values():
            ctx.setdefault(f.predicate, []).append(f.args)
        return ctx

    def step(self) -> list[Fact]:
        """
        Apply all rules once; add new facts. Returns newly derived facts.
        Testable.
        """
        ctx = self.get_context()
        new: list[Fact] = []
        for rule in self._rules:
            if rule.condition(ctx):
                conclusion = rule.conclusion(ctx)
                if conclusion is not None:
                    k = conclusion.key()
                    if k not in self._facts:
                        self._facts[k] = conclusion
                        new.append(conclusion)
        return new

    def run(self, max_steps: int = 100) -> list[Fact]:
        """Run steps until no new facts or max_steps. Returns all new facts. Testable."""
        all_new: list[Fact] = []
        for _ in range(max_steps):
            new = self.step()
            if not new:
                break
            all_new.extend(new)
        return all_new


def create_reasoning_engine() -> ReasoningEngine:
    """Create empty reasoning engine. Testable."""
    return ReasoningEngine()
