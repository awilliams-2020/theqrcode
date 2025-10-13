#!/bin/sh
set -e

echo "Starting TheQRCode.io container..."

# Note: Cron jobs are managed by host system, not container
# See host crontab for scheduled tasks

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy || echo "⚠ Migration failed or no migrations to run"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Start the Next.js application
echo "Starting Next.js application..."
exec npm start

