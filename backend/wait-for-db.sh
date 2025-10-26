#!/bin/sh
# Wait for Postgres to be ready before starting the backend

set -e

host="$POSTGRES_HOST"
shift

until pg_isready -h "$host" -p 5432 -U "$POSTGRES_USER"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - starting backend"
exec node /app/server.js
