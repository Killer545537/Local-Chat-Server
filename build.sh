#!/bin/bash

set -e

PORT=8080
ADDRESS="$(ipconfig getifaddr en0):$PORT"

echo "Building frontend..."
cd frontend

export NEXT_PUBLIC_API_URL="$ADDRESS"
echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"

pnpm install
pnpm build
cd ..

echo "Setting up environment variables..."

DATABASE_URL="postgres://postgres:killer2005@localhost:5432/Chat"
JWT_SECRET=$(openssl rand -base64 32)

echo "DATABASE_URL=$DATABASE_URL"
echo "ADDRESS=$ADDRESS"
echo "JWT_SECRET=$JWT_SECRET"

echo "Building backend"
cd backend

export DATABASE_URL
export ADDRESS
export JWT_SECRET

cargo build --release
cp target/release/backend ../build/

echo "Build complete"
