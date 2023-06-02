#!/bin/bash

image="ghcr.io/premai-io/premd:v0.0.8" # replace this with your image name
container_name="premd"

# Check if container exists
if [ "$(docker ps -q -f name=$container_name)" ]; then
    # If it exists and it's running, stop it
    if [ "$(docker ps -q -f status=running -f name=$container_name)" ]; then
        echo "Stopping existing container..."
        docker stop $container_name
    fi
    # Remove existing container
    echo "Removing existing container..."
    docker rm $container_name
fi

/usr/local/bin/docker run -d \
-v /var/run/docker.sock:/var/run/docker.sock \
-p 54321:8000 \
--name $container_name \
-e PREM_REGISTRY_URL=https://raw.githubusercontent.com/premAI-io/prem-daemon/main/resources/mocks/manifests.json \
--rm \
$image

if [ $? -eq 0 ]
then
  echo "Docker run command executed successfully"
else
  echo "Failed to execute docker run" >&2
  exit 1
fi
