"""
Environment and config loader for engine-ai-service.
Additive: service-specific config only.
"""
import os
from dataclasses import dataclass


@dataclass
class ServiceConfig:
    host: str
    port: int
    service_name: str
    log_level: str


def load_config() -> ServiceConfig:
    return ServiceConfig(
        host=os.getenv("ENGINE_AI_SERVICE_HOST", "0.0.0.0"),
        port=int(os.getenv("ENGINE_AI_SERVICE_PORT", "5011")),
        service_name=os.getenv("SERVICE_NAME", "engine-ai-service"),
        log_level=os.getenv("LOG_LEVEL", "INFO"),
    )
