#!/bin/bash

# Set the paths to the Python script, requirements file, and bash script
TAURI_PATH="$(pwd)/src-tauri"
PYTHON_SCRIPT_PATH="${TAURI_PATH}/petals/run_petals.py"
REQUIREMENTS_FILE_PATH="${TAURI_PATH}/petals/requirements.txt"
DIST_PATH="${TAURI_PATH}/bin/python"

# Create a Python virtual environment
python3 -m venv prem

# Activate the virtual environment
source prem/bin/activate

# Install the necessary packages
pip install -r $REQUIREMENTS_FILE_PATH

# # Package the Python script
pyinstaller --onefile $PYTHON_SCRIPT_PATH --distpath $DIST_PATH --clean -n petals-aarch64-apple-darwin

# Deactivate the virtual environment
deactivate

rm -r "$(pwd)/prem"