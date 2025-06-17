#!/bin/bash

set -e

cd build

# Prepare environment variables
DATABASE_URL="postgres://postgres:killer2005@localhost:5432/Chat"
ADDRESS="$(ipconfig getifaddr en0):8080"
JWT_SECRET="$(openssl rand -base64 32)"

echo "Running backend with:"
echo "DATABASE_URL=$DATABASE_URL"
echo "ADDRESS=$ADDRESS"
echo "JWT_SECRET=$JWT_SECRET"

DATABASE_URL="$DATABASE_URL" \
  ADDRESS="$ADDRESS" \
  JWT_SECRET="$JWT_SECRET" \
  ./backend
