#!/bin/bash
set -e

# required inputs
TAURI_PATH="$(dirname "$(dirname "$0")")/src-tauri"
PYTHON_SCRIPT_PATH="${TAURI_PATH}/petals/run_petals.py"
REQUIREMENTS_FILE_PATH="${TAURI_PATH}/petals/requirements.txt"
DIST_PATH="${TAURI_PATH}/bin/python"
ARCH=${1:-arm64}
ARCH_NAME=${2:-aarch64}

# Create & activate virtual env
test -f venv-prem/bin/activate || python3 -m venv venv-prem
source venv-prem/bin/activate
pip install -r $REQUIREMENTS_FILE_PATH

# Package Python script
pyinstaller \
  --onefile \
  --clean \
  --distpath="$DIST_PATH" \
  --target-arch=$ARCH \
  --name=petals-${ARCH_NAME}-apple-darwin \
  "$PYTHON_SCRIPT_PATH"

# Remove virtual env
deactivate
rm -r venv-prem
