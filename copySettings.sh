#!/usr/bin/env bash

# Copy the generated/updated settings.json file from orchestrator/main to
#  all other microservices

cd ~/qewd-hit-platform
cp main/configuration/settings.json .

cp settings.json ./oidc-client/configuration
cp settings.json ./oidc-provider/configuration
cp settings.json ./fhir-mpi/configuration
cp settings.json ./audit-ms/configuration
cp settings.json ./openehr-ms/configuration

echo "settings.json has been copied to all other MicroService folders"


