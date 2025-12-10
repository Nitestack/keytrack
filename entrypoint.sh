#!/usr/bin/env sh

set -xe

echo "Creating necessary directories"
mkdir -p /app/uploads/scores

echo "Running database migrations"
npm run db:migrate

echo "Starting the server"
node server.js
