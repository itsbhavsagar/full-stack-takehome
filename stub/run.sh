#!/usr/bin/env bash
# Starts the stub profile-builder on :9000 (override with PORT).
#
# Creates stub/.venv on first run and rebuilds it automatically if it's
# broken — e.g. after the project folder is moved, since venvs hardcode
# absolute paths. Uses `python -m uvicorn` instead of the .venv/bin/uvicorn
# wrapper so a stale shebang can never bite.
#
# Usage:
#   ./stub/run.sh                    # full ~40s builds
#   BUILD_SECONDS=8 ./stub/run.sh    # faster builds for local dev
set -euo pipefail
cd "$(dirname "$0")"

if ! .venv/bin/python -c 'import fastapi, uvicorn' >/dev/null 2>&1; then
  echo "Setting up stub/.venv ..."
  rm -rf .venv
  python3 -m venv .venv
  .venv/bin/pip install --quiet -r requirements.txt
fi

exec .venv/bin/python -m uvicorn profile_builder_stub:app --port "${PORT:-9000}" "$@"
