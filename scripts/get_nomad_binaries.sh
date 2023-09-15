#!/bin/bash

url_arm64="https://releases.hashicorp.com/nomad/1.6.2/nomad_1.6.2_darwin_arm64.zip"
url_amd64="https://releases.hashicorp.com/nomad/1.6.2/nomad_1.6.2_darwin_amd64.zip"

download_dir="src-tauri/bin"

mkdir -p "$download_dir"

curl -o "$download_dir/nomad_1.6.2_darwin_arm64.zip" "$url_arm64"
unzip "$download_dir/nomad_1.6.2_darwin_arm64.zip" -d "$download_dir"
mv "$download_dir/nomad" "$download_dir/nomad-aarch64-apple-darwin"
rm "$download_dir/nomad_1.6.2_darwin_arm64.zip"

curl -o "$download_dir/nomad_1.6.2_darwin_amd64.zip" "$url_amd64"
unzip "$download_dir/nomad_1.6.2_darwin_amd64.zip" -d "$download_dir"
mv "$download_dir/nomad" "$download_dir/nomad-x86_64-apple-darwin"
rm "$download_dir/nomad_1.6.2_darwin_amd64.zip"

echo "Downloaded and unzipped Nomad binaries to $download_dir"
