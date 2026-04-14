#!/usr/bin/env bash
# Run create-stripe-customers-for-active-users.ts inside the main app container (so it can reach postgres and use Stripe env).
# Usage: ./scripts/run-create-stripe-customers-in-container.sh
# Dry run (no Stripe or DB writes): DRY_RUN=1 ./scripts/run-create-stripe-customers-in-container.sh
#
# Requires: theqrcode container running, and repo at same path on host as used here.
# Copies scripts/ and src/ into the container then execs. Container env (DATABASE_URL, STRIPE_SECRET_KEY, etc.) is already set by compose.

set -e
CONTAINER="${CONTAINER:-theqrcode}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Copying scripts and src into $CONTAINER..."
docker cp "$REPO_ROOT/scripts" "$CONTAINER:/app/"
docker cp "$REPO_ROOT/src" "$CONTAINER:/app/"

if [ -n "$DRY_RUN" ]; then
  echo "Dry run: no Stripe or DB changes will be made."
  docker exec -e DRY_RUN="$DRY_RUN" "$CONTAINER" sh -c 'cd /app && npx tsx scripts/create-stripe-customers-for-active-users.ts'
else
  docker exec "$CONTAINER" sh -c 'cd /app && npx tsx scripts/create-stripe-customers-for-active-users.ts'
fi
