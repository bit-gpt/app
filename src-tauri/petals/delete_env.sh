# Define the Miniconda installation path
miniconda_path=${PREM_APPDIR:-.}

# Check if Miniconda is installed
if [ -d "$miniconda_path" ]; then
    rm -rf "$miniconda_path"
fi