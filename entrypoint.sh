#!/bin/sh

set -e

# Creating necessary directories
mkdir -p /app/uploads/scores

# Running database migrations
node migrate.js

# Running the command passed to the entrypoint
exec "$@"
