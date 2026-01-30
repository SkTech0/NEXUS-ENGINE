# Deployment Model

How extracted services are deployed.

## Per-Service Deployment

Each service has its own:

- **Docker image:** Built from `services/<name>/infra/Dockerfile` (build context: service root).
- **docker-compose:** `deploy/services/<name>/docker-compose.yaml` (context points to `services/<name>`).
- **Kubernetes:** `deploy/services/<name>/k8s.yaml` (Deployment + Service).

## Build and Run

- **Local:** From repo root, run each service with `python run.py` from `services/<name>/`, or use `runtime-decoupling/services/*-runner.ts`.
- **Docker Compose:** From `deploy/services/<name>/`, run `docker-compose up` (context in YAML points to `../../services/<name>`). Or from repo root: `docker-compose -f deploy/services/engine-ai-service/docker-compose.yaml --project-directory . up`.
- **Kubernetes:** Build and push images, then `kubectl apply -f deploy/services/<name>/k8s.yaml`.

## Ports

| Service | Port |
|---------|------|
| engine-ai-service | 5011 |
| engine-intelligence-service | 5012 |
| engine-optimization-service | 5013 |
| engine-trust-service | 5014 |
| engine-data-service | 5015 |
| engine-distributed-service | 5016 |

## Scaling

- Each service can be scaled independently (replicas in K8s or multiple Compose instances).
- engine-api routes to discovered/configured instances via gateway-registry.

## Independence

- Independent deployment pipelines per service.
- Independent config (env, ConfigMaps, Secrets).
- Independent rollbacks and versioning.
