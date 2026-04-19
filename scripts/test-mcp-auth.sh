#!/usr/bin/env bash
# Test production MCP + API auth. Requires MCP_KEY in the environment (never commit keys).
# Usage: MCP_KEY=qr_... ./scripts/test-mcp-auth.sh
set -uo pipefail

MCP_BASE="${MCP_BASE:-https://mcp.theqrcode.io}"
API_BASE="${API_BASE:-https://theqrcode.io}"

if [[ -z "${MCP_KEY:-}" ]]; then
  echo "Set MCP_KEY to your API key (Bearer token), e.g.:" >&2
  echo "  MCP_KEY=qr_... ./scripts/test-mcp-auth.sh" >&2
  exit 1
fi

echo "=== GET ${MCP_BASE}/health ==="
curl -sS --connect-timeout 15 --max-time 30 -w "\nHTTP %{http_code}\n" "${MCP_BASE}/health" || true
echo ""

echo "=== POST ${MCP_BASE}/mcp  tools/list (authenticated) ==="
TMP1=$(mktemp)
CODE1=$(curl -sS --connect-timeout 15 --max-time 60 -o "${TMP1}" -w "%{http_code}" "${MCP_BASE}/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer ${MCP_KEY}" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}') || true
head -c 4000 "${TMP1}"
echo ""
echo "HTTP ${CODE1}"
if command -v jq >/dev/null 2>&1; then
  JSON_LINE=$(grep '^data:' "${TMP1}" | tail -1 | sed 's/^data: *//')
  if [[ -n "${JSON_LINE}" ]]; then
    echo "--- tool names ---"
    echo "${JSON_LINE}" | jq -r '.result.tools[]?.name // empty' 2>/dev/null || true
  fi
fi
rm -f "${TMP1}"
echo ""

echo "=== POST ${MCP_BASE}/mcp  tools/call list_qr_codes ==="
TMP2=$(mktemp)
CODE2=$(curl -sS --connect-timeout 15 --max-time 60 -o "${TMP2}" -w "%{http_code}" "${MCP_BASE}/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer ${MCP_KEY}" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_qr_codes","arguments":{"page":1,"limit":3}}}') || true
head -c 4000 "${TMP2}"
echo ""
echo "HTTP ${CODE2}"
rm -f "${TMP2}"
echo ""

echo "=== GET ${API_BASE}/api/v1/qr-codes?page=1&limit=3 (same key) ==="
curl -sS --connect-timeout 15 --max-time 30 \
  -H "Authorization: Bearer ${MCP_KEY}" \
  "${API_BASE}/api/v1/qr-codes?page=1&limit=3" \
  -w "\nHTTP %{http_code}\n" | head -c 3000
echo ""

echo "Done. Revoke this key in the dashboard if this was a one-off test."
