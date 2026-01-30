"""Config loader for engine-trust-service."""
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
        host=os.getenv("ENGINE_TRUST_SERVICE_HOST", "0.0.0.0"),
        port=int(os.getenv("ENGINE_TRUST_SERVICE_PORT", "5014")),
        service_name=os.getenv("SERVICE_NAME", "engine-trust-service"),
        log_level=os.getenv("LOG_LEVEL", "INFO"),
    )
