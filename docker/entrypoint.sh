#!/bin/sh
set -e

ENV=${NODE_ENV:-production}
echo "Starting TheQRCode.io container (${ENV})..."

# Note: Cron jobs are managed by host system, not container
# See host crontab for scheduled tasks

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy || echo "⚠ Migration failed or no migrations to run"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Start the Next.js application
# Logging: Docker native logging (persistent) + file for convenience
# Docker logs: docker logs theqrcode (persistent, rotated by Docker)
# File logs: environment-specific log files (rotated by logrotate, NULLs cleaned by script)
if [ "$ENV" = "development" ]; then
  LOG_FILE="/var/log/theqrcode-dev.log"
else
  LOG_FILE="/var/log/theqrcode.log"
fi
echo "Starting Next.js application (${ENV})..."
echo "Logging to: ${LOG_FILE}"

# Use tee to write to both stdout (Docker logs) and file
# Logrotate will clean NULL bytes that appear after rotation
# Note: npm start output may be buffered, but tee should still capture it
exec npm start 2>&1 | tee -a "${LOG_FILE}"

