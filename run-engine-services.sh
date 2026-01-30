#!/bin/sh
# Run engine-services (Python FastAPI) on port 5001.
# Use with engine-api: set Engines:BaseUrl=http://localhost:5001 and run engine-api (run-api.sh).
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

exec python3 -m uvicorn main:app --host 0.0.0.0 --port 5001 --app-dir "$ENGINE_SERVICES_DIR"
