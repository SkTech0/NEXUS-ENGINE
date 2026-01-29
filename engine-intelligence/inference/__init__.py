"""Inference: premises, conclusions, handlers."""
from .inference_engine import (
    Conclusion,
    InferenceEngine,
    Premise,
    create_inference_engine,
)

__all__ = [
    "Premise",
    "Conclusion",
    "InferenceEngine",
    "create_inference_engine",
]
