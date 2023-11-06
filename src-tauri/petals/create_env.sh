#!/usr/bin/env bash
prem_appdir="${PREM_APPDIR:-.}"
conda_prefix="$prem_appdir/miniconda"

if test ! -x "$conda_prefix/bin/mamba"; then
  echo "Conda not found"
  os="$(uname)"
  case "$os" in
    Darwin|Linux)
      ;;
    *)
      echo >&2 "Unsupported operating system: $os"
      exit 1
      ;;
  esac
  arch="$(uname -m)"

  mkdir -p "$conda_prefix"
  echo "Downloading Conda installer for $os-$arch"
  curl -fsSL "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$os-$arch.sh" --output "$prem_appdir/conda_install.sh"
  echo "Installing Conda at '$conda_prefix'"
  sh "$prem_appdir/conda_install.sh" -b -u -p "$conda_prefix"
fi

echo "Using Conda at '$conda_prefix'"
export PREM_PYTHON="$conda_prefix/envs/prem_app/bin/python"

echo "Ensuring env 'prem_app' exists"
test -x "$PREM_PYTHON" || "$conda_prefix/bin/mamba" create -y -n prem_app python=3.11