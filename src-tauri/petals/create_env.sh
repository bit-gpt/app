# Define the Miniconda installation path and environment name
miniconda_path=${PREM_APPDIR:-.}
conda_env=${PREM_PYTHON:-python}
requirements=${REQUIREMENTS:-requirements.txt}

# Function to install Miniconda if not already present
install_miniconda() {
    local arch

    if [ "$(uname -s)" == "Darwin" ]; then
        # macOS
        if [ "$1" == "x86_64" ]; then
            arch="x86_64"
        elif [ "$1" == "arm64" ]; then
            arch="arm64"
        else
            echo "Unsupported architecture: $1"
            exit 1
        fi
    elif [ "$(uname -s)" == "Linux" ]; then
        # Linux
        if [ "$1" == "x86_64" ]; then
            arch="x86_64"
        elif [ "$1" == "aarch64" ]; then
            arch="aarch64"
        elif [ "$1" == "armv7l" ]; then
            arch="armv7l"
        else
            echo "Unsupported architecture: $1"
            exit 1
        fi
    else
        echo "Unsupported operating system: $(uname -s)"
        exit 1
    fi

    # Create the 'appdir' directory if it doesn't exist
    if [ ! -d "$miniconda_path" ]; then
        mkdir "$miniconda_path"

        # Download and install Miniconda based on OS and architecture
        if [ "$(uname -s)" == "Darwin" ]; then
            wget -nv "https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-$arch.sh" -O "$miniconda_path/miniconda_installer.sh"
        elif [ "$(uname -s)" == "Linux" ]; then
            wget -nv "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-$arch.sh" -O "$miniconda_path/miniconda_installer.sh"
        fi

        bash "$miniconda_path/miniconda_installer.sh" -b -u -p "$miniconda_path"
    else
        echo "Using existing Miniconda in '$miniconda_path'."
    fi
}

# Check if Miniconda is already installed
if ! command -v "$miniconda_path/bin/conda" &>/dev/null; then
    install_miniconda "$(uname -m)"
fi

# Check if the Miniconda environment 'prem_env' exists
if [ ! -d "$miniconda_path/envs/$conda_env" ]; then
    "$miniconda_path/bin/conda" create -n "$conda_env" python=3.11 -y
    "$miniconda_path/envs/$conda_env/bin/pip" install -r "$requirements"
fi