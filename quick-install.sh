#!/usr/bin/env bash

# Quick Installer for QEWD HIT Platform

# This starts the Node-Runner Container with the correct environment settings and parameters

VOLUME=${1-$PWD}
PLATFORM=$(uname -m)

echo 'Running Node-Runner Container with volume '$VOLUME

echo 'If you are running this for the first time, the Node-Runner Container'
echo 'will first be downloaded from Docker Hub.'
echo 'If so, please wait for it to load'

# Create the Docker networks unless they already exist

docker network ls|grep qewd-hit > /dev/null || docker network create qewd-hit
docker network ls|grep ecis-net > /dev/null || docker network create ecis-net

#echo $PLATFORM


if [[ "$PLATFORM" != "armv"* ]]

then

  echo "Making sure you have the latest versions of the Docker Containers..."

  docker pull rtweed/node-runner
  docker pull rtweed/qewd-server
  docker pull rtweed/ethercis-db
  docker pull rtweed/ethercis-server

  echo "running node-runner for Linux"

  docker run -it --name installer --rm -v $VOLUME:/node -e "node_script=quick-install" -e "PLATFORM=linux" -e "DOCKER_HOST=$(ip -4 addr | grep -Po 'inet \K[\d.]+')" -e "HOST_VOLUME=$VOLUME" rtweed/node-runner

else

  echo "Making sure you have the latest QEWD Container..."
  docker pull rtweed/qewd-server-rpi
  docker pull rtweed/node-runner-rpi
  docker pull rtweed/ethercis-db-rpi
  docker pull rtweed/ethercis-server-rpi
  echo "running node-runner for Raspberry Pi"

  docker run -it --name installer --rm -v $VOLUME:/node -e "node_script=quick-install" -e "PLATFORM=arm" -e "DOCKER_HOST=$(ip -4 addr | grep -Po 'inet \K[\d.]+')" -e "HOST_VOLUME=$VOLUME" rtweed/node-runner-rpi

fi
