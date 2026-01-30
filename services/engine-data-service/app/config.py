"""Config loader for engine-data-service."""
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
        host=os.getenv("ENGINE_DATA_SERVICE_HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", os.getenv("ENGINE_DATA_SERVICE_PORT", "5015"))),
        service_name=os.getenv("SERVICE_NAME", "engine-data-service"),
        log_level=os.getenv("LOG_LEVEL", "INFO"),
    )
