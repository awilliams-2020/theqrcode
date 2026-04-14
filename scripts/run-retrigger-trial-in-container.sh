#!/usr/bin/env bash
# Run retrigger-trial-conversion.ts inside the main app container (so it can reach postgres).
# Usage: ./scripts/run-retrigger-trial-in-container.sh <userId>
# Example: ./scripts/run-retrigger-trial-in-container.sh cmlztm7g80007l54yehrpwrcm
#
# Requires: theqrcode container running, and repo at same path on host as used here.
# Copies scripts/ and src/ into the container then execs. Container env (DATABASE_URL, etc.) is already set by compose.

set -e
CONTAINER="${CONTAINER:-theqrcode}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
USER_ID="${1:?Usage: $0 <userId>}"

echo "Copying scripts and src into $CONTAINER..."
docker cp "$REPO_ROOT/scripts" "$CONTAINER:/app/"
docker cp "$REPO_ROOT/src" "$CONTAINER:/app/"

echo "Running retrigger-trial-conversion for user $USER_ID..."
docker exec "$CONTAINER" sh -c "cd /app && npx tsx scripts/google-ads/retrigger-trial-conversion.ts $USER_ID"
