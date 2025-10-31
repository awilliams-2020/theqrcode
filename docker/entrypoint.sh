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
# Logging: Docker native logging (persistent) + file for convenience
# Docker logs: docker logs theqrcode (persistent, rotated by Docker)
# File logs: /var/log/theqrcode.log (rotated by logrotate, NULLs cleaned by script)
echo "Starting Next.js application..."

# Use tee to write to both stdout (Docker logs) and file
# Logrotate will clean NULL bytes that appear after rotation
exec npm start 2>&1 | tee -a /var/log/theqrcode.log

