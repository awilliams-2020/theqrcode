#!/usr/bin/env bash
# Test production MCP + API auth. Requires MCP_KEY in the environment (never commit keys).
# Calls every MCP tool exposed for an authenticated session: generate_qr_code, list_qr_codes,
# get_analytics (see mcp-server/src/index.ts). Developer-plan keys are required for the
# extended tools; lower tiers will surface errors in the tool responses.
# Usage: MCP_KEY=qr_... ./scripts/test-mcp-auth.sh
set -uo pipefail

MCP_BASE="${MCP_BASE:-https://mcp.theqrcode.io}"
API_BASE="${API_BASE:-https://theqrcode.io}"

if [[ -z "${MCP_KEY:-}" ]]; then
  echo "Set MCP_KEY to your API key (Bearer token), e.g.:" >&2
  echo "  MCP_KEY=qr_... ./scripts/test-mcp-auth.sh" >&2
  exit 1
fi

# POST tools/call with JSON-RPC body; prints first ~4KB of SSE/body and HTTP status.
mcp_call_tool() {
  local title=$1
  local rpc_id=$2
  local tool_name=$3
  local args_json=$4

  echo "=== POST ${MCP_BASE}/mcp  tools/call ${tool_name} (${title}) ==="
  local tmp code
  tmp=$(mktemp)
  code=$(curl -sS --connect-timeout 15 --max-time 60 -o "${tmp}" -w "%{http_code}" "${MCP_BASE}/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -H "Authorization: Bearer ${MCP_KEY}" \
    -d "$(printf '{"jsonrpc":"2.0","id":%s,"method":"tools/call","params":{"name":"%s","arguments":%s}}' \
      "${rpc_id}" "${tool_name}" "${args_json}")") || true
  head -c 4000 "${tmp}"
  echo ""
  echo "HTTP ${code}"
  rm -f "${tmp}"
  echo ""
}

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

# All tools available with Bearer auth (extended tools may 403 at API if not Developer plan).
mcp_call_tool "minimal url QR" 3 "generate_qr_code" '{"type":"url","content":"https://example.com"}'
mcp_call_tool "pagination sample" 4 "list_qr_codes" '{"page":1,"limit":3}'
mcp_call_tool "account-wide window" 5 "get_analytics" '{"timeRange":"7d"}'

echo "=== GET ${API_BASE}/api/v1/qr-codes?page=1&limit=3 (same key) ==="
curl -sS --connect-timeout 15 --max-time 30 \
  -H "Authorization: Bearer ${MCP_KEY}" \
  "${API_BASE}/api/v1/qr-codes?page=1&limit=3" \
  -w "\nHTTP %{http_code}\n" | head -c 3000
echo ""

echo "=== GET ${API_BASE}/api/v1/analytics?timeRange=7d (same key) ==="
curl -sS --connect-timeout 15 --max-time 30 \
  -H "Authorization: Bearer ${MCP_KEY}" \
  "${API_BASE}/api/v1/analytics?timeRange=7d" \
  -w "\nHTTP %{http_code}\n" | head -c 3000
echo ""

echo "Done. Revoke this key in the dashboard if this was a one-off test."
