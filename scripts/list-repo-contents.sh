#!/usr/bin/env bash
# List paths to copy when extracting a service into its own repo.
# Usage: ./scripts/list-repo-contents.sh <service-name>
# Example: ./scripts/list-repo-contents.sh engine-data
#
# Service names: engine-data | engine-intelligence | engine-ai | engine-optimization | engine-trust | engine-distributed | engine-api | product-ui | contracts | platform

NAME="${1:?Usage: $0 <service-name>}"

case "$NAME" in
  engine-data)
    echo "# nexus-engine-data - copy these paths (from monorepo root):"
    echo "engine-data/"
    echo "services/engine-data-service/"
    echo "deploy/railway/engine-data/"
    ;;
  engine-intelligence)
    echo "# nexus-engine-intelligence - copy these paths:"
    echo "engine-intelligence/"
    echo "services/engine-intelligence-service/"
    echo "deploy/railway/engine-intelligence/"
    ;;
  engine-ai)
    echo "# nexus-engine-ai - copy these paths:"
    echo "engine-ai/"
    echo "services/engine-ai-service/"
    echo "deploy/railway/engine-ai/"
    ;;
  engine-optimization)
    echo "# nexus-engine-optimization - copy these paths:"
    echo "engine-optimization/"
    echo "services/engine-optimization-service/"
    echo "deploy/railway/engine-optimization/"
    ;;
  engine-trust)
    echo "# nexus-engine-trust - copy these paths:"
    echo "engine-trust/"
    echo "services/engine-trust-service/"
    echo "deploy/railway/engine-trust/"
    ;;
  engine-distributed)
    echo "# nexus-engine-distributed - copy these paths:"
    echo "engine-distributed/"
    echo "services/engine-distributed-service/"
    echo "deploy/railway/engine-distributed/"
    ;;
  engine-api)
    echo "# nexus-engine-api - copy these paths:"
    echo "engine-api/"
    echo "deploy/railway/engine-api/"
    ;;
  product-ui)
    echo "# nexus-product-ui - copy these paths:"
    echo "product-ui/"
    echo "deploy/railway/product-ui/"
    ;;
  contracts)
    echo "# nexus-contracts - copy these paths:"
    echo "engine-contracts/"
    echo "api-platform/"
    echo "contracts/"
    ;;
  platform)
    echo "# nexus-platform - copy these paths:"
    echo "engine-core/"
    echo "gateway-layer/"
    echo "orchestration-layer/"
    echo "deploy/"
    echo "config/"
    echo "env/"
    echo "scripts/"
    echo "infra/"
    echo "service-mesh/"
    echo "docs/"
    ;;
  *)
    echo "Unknown service: $NAME" >&2
    echo "Valid: engine-data | engine-intelligence | engine-ai | engine-optimization | engine-trust | engine-distributed | engine-api | product-ui | contracts | platform" >&2
    exit 1
    ;;
esac
