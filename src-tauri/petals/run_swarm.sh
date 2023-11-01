#!/usr/bin/env bash

# Usage: ./run_swarm.sh <num_blocks> <public_name> <model>
#
# Parameters:
#   num_blocks: The number of blocks to use.
#   public_name: The public name to use.
#   model: The model to use.

prem_python="${PREM_PYTHON:-python}"
requirements="$(dirname "$0")/requirements.txt"

echo "Installing requirements"
"$prem_python" -m pip install -r "$requirements"

echo "Running petals"
"$prem_python" -m petals.cli.run_server \
    --num_blocks "$1" \
    --public_name "$2" \
    "$3"