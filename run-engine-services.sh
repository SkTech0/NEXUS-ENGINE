#!/bin/sh
# Run engine-services (Python FastAPI) on port 5002.
# Use with engine-api: Engines__BaseUrl=http://localhost:5002 (run-api-with-engines.sh).
# Usage: ./run-engine-services.sh

set -e
cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 not found; install Python 3 and try again."
  exit 1
fi

ENGINE_SERVICES_DIR="engine-services"
if [ ! -d "$ENGINE_SERVICES_DIR" ]; then
  echo "Missing $ENGINE_SERVICES_DIR directory."
  exit 1
fi

# Install deps if needed (venv at repo root so engine-* can be found via path in main.py)
VENV_DIR=".venv-engine-services"
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi
. "$VENV_DIR/bin/activate"
pip install -q -r "$ENGINE_SERVICES_DIR/requirements.txt"

# Port 5002 to avoid conflict with engine-api (5000/5001)
# Run from engine-services dir so cwd is not repo root (avoids platform/ namespace shadowing stdlib)
cd "$ENGINE_SERVICES_DIR"
exec python3 -m uvicorn main:app --host 0.0.0.0 --port 5002
