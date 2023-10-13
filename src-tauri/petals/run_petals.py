import argparse
import os
import subprocess

def run_command(num_blocks, public_name, model):
    command = f"/usr/bin/python3 -m petals.cli.run_server --num_blocks {num_blocks} --public_name {public_name} {model}"
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)
    output, error = process.communicate()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--num_blocks', type=int, required=True)
    parser.add_argument('--public_name', type=str, required=True)
    parser.add_argument('--model', type=str, required=True)
    args = parser.parse_args()
    run_command(args.num_blocks, args.public_name, args.model)
