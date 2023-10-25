#!/usr/bin/env bash
prem_appdir="${PREM_APPDIR:-.}"
requirements="${REQUIREMENTS:-requirements.txt}"
conda_prefix="$prem_appdir/miniconda"

# install conda if not found
install_conda() {
  arch="$(uname -m)"
  os="$(uname -s)"
  case "$os" in
    Darwin)
      case "$arch" in
        x86_64|arm64)
          ;;
        *)
          echo >&2 "Unsupported architecture: $arch"
          exit 1
          ;;
      esac
      ;;
    Linux)
      case "$arch" in
        x86_64|aarch64|armv7l)
          ;;
        *)
          echo >&2 "Unsupported architecture: $arch"
          exit 1
          ;;
      esac
      ;;
    *)
      echo >&2 "Unsupported operating system: $os"
      exit 1
      ;;
  esac

  if test ! -d "$conda_prefix"; then
    mkdir -p "$conda_prefix"
    # download installer
    case "$(uname -s)" in
      Darwin)
        wget -nv "https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-$arch.sh" -O "$prem_appdir/conda_install.sh"
        ;;
      Linux)
        wget -nv "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-$arch.sh" -O "$prem_appdir/conda_install.sh"
        ;;
    esac
    # install
    sh "$prem_appdir/conda_install.sh" -b -u -p "$conda_prefix"
  else
    echo "Using existing Conda in '$conda_prefix'"
  fi
}

# install conda if not found
test -x "$conda_prefix/bin/conda" || install_conda

# ensure prem_app env exists
export PREM_PYTHON="conda_prefix/envs/prem_app/bin/python"
test -x "$PREM_PYTHON" || "$conda_prefix/bin/conda" create -n prem_app python=3.11 -y

# install requirements
"$PREM_PYTHON" -m pip install -r "$requirements"
