#!/bin/bash

container_name="premd"

# Check if container exists
if [ "$(docker ps -aq -f name=$container_name)" ]; then
    # Stop and remove the container
    echo "Stopping and removing existing container..."
    docker stop $container_name
    docker rm $container_name
else
    echo "Container $container_name does not exist."
fi
