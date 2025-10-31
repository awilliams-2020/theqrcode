#!/bin/bash

# Application Log Monitor
# This script helps monitor application logs with domain-specific filtering
# Uses log file if available, otherwise falls back to Docker logs

CONTAINER_NAME="theqrcode"
LOG_FILE="/home/awilliams/logs/theqrcode.log"

echo "🔍 Application Log Monitor"
echo "=========================="
if [ -f "$LOG_FILE" ]; then
    echo "Monitoring: $LOG_FILE"
else
    echo "Monitoring: Docker logs from container '$CONTAINER_NAME'"
    echo "(Log file not found, using Docker logs)"
fi
echo "Press Ctrl+C to stop"
echo ""

# Function to get logs from Docker container or file
get_logs() {
    if [ -f "$LOG_FILE" ]; then
        cat "$LOG_FILE"
    else
        docker logs "$CONTAINER_NAME" 2>&1
    fi
}

# Function to show recent logs by category
show_recent_logs() {
    local category="${1:-ALL}"
    if [ "$category" = "ALL" ]; then
        echo "📋 Recent Logs (last 20 lines):"
        echo "==============================="
        get_logs | grep -E "\[.*\] \[.*\] \[.*\]" | tail -20
    else
        echo "📋 Recent $category Logs (last 20 lines):"
        echo "========================================"
        get_logs | grep -E "\[.*\] \[.*\] \[$category\]" | tail -20
    fi
}

# Function to show recent bot detection attempts
show_recent_bots() {
    echo "🚨 Bot Detection Logs (last 20 lines):"
    echo "======================================"
    get_logs | grep -E "\[.*\] \[.*\] \[BOT-DETECTION\]" | tail -20
}

# Function to show application summary
show_summary() {
    echo "📊 Log Summary"
    echo "=============="
    
    # Get logs once and reuse
    local logs=$(get_logs)
    
    # Bot detection stats (only count structured logs)
    local bot_attempts=$(echo "$logs" | grep -E "\[.*\] \[.*\] \[BOT-DETECTION\]" | grep -c "Bot detected:" | tr -d '\n' || echo "0")
    local oauth_attempts=$(echo "$logs" | grep -E "\[.*\] \[.*\] \[BOT-DETECTION\]" | grep -c "OAuth request detected" | tr -d '\n' || echo "0")
    local api_attempts=$(echo "$logs" | grep -E "\[.*\] \[.*\] \[BOT-DETECTION\]" | grep -c "API.*Bot detected" | tr -d '\n' || echo "0")
    local bot_blocks=$(echo "$logs" | grep -E "\[.*\] \[.*\] \[BOT-DETECTION\]" | grep -c "Bot detected and blocked" | tr -d '\n' || echo "0")
    local legitimate_oauth=$(echo "$logs" | grep -E "\[.*\] \[.*\] \[BOT-DETECTION\]" | grep -c "Legitimate OAuth request allowed" | tr -d '\n' || echo "0")
    
    echo "🤖 Bot Detection: $bot_attempts attempts, $bot_blocks blocked, $legitimate_oauth allowed"
    echo ""
    
    # Log category stats (only show non-zero categories)
    echo "📋 Categories:"
    local categories=("API" "AUTH" "QR-CODE" "ANALYTICS" "NOTIFICATION" "PAYMENT" "SYSTEM" "MATOMO" "ERROR")
    local has_categories=false
    for category in "${categories[@]}"; do
        local count=$(echo "$logs" | grep -E "\[.*\] \[.*\] \[$category\]" | wc -l | tr -d '\n' || echo "0")
        if [ "$count" -gt 0 ]; then
            echo "  $category: $count"
            has_categories=true
        fi
    done
    if [ "$has_categories" = false ]; then
        echo "  No categorized logs found"
    fi
    echo ""
    
    # Domain-specific stats (only show actual domains, not timestamps)
    echo "🌐 Domains:"
    local domains=$(echo "$logs" | grep -E "\[.*\] \[.*\] \[.*\] \[.*\]" | grep -o '\[[a-zA-Z0-9.-]*\]$' | sed 's/\[//g' | sed 's/\]//g' | sort -u)
    if [ -n "$domains" ]; then
        for domain in $domains; do
            # Skip if it looks like a timestamp
            if [[ ! "$domain" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T ]]; then
                local domain_logs=$(echo "$logs" | grep -E "\[.*\] \[.*\] \[.*\] \[$domain\]" | wc -l | tr -d '\n' || echo "0")
                local domain_errors=$(echo "$logs" | grep -E "\[.*\] \[ERROR\] \[.*\] \[$domain\]" | wc -l | tr -d '\n' || echo "0")
                if [ "$domain_logs" -gt 0 ]; then
                    echo "  $domain: $domain_logs total, $domain_errors errors"
                fi
            fi
        done
    else
        echo "  No domain data found"
    fi
}

# Function to show real-time monitoring
monitor_realtime() {
    echo "👀 Live Monitoring:"
    echo "=================="
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE" | grep --line-buffered -E "\[.*\] \[.*\] \[.*\]"
    else
        docker logs -f "$CONTAINER_NAME" 2>&1 | grep --line-buffered -E "\[.*\] \[.*\] \[.*\]"
    fi
}

# Main menu
case "${1:-menu}" in
    "recent")
        show_recent_logs "${2:-ALL}"
        ;;
    "bots")
        show_recent_bots
        ;;
    "summary")
        show_summary
        ;;
    "monitor"|"live")
        monitor_realtime
        ;;
    "menu"|*)
        echo "Usage: $0 [recent|bots|summary|monitor|live]"
        echo ""
        echo "Commands:"
        echo "  recent [category] - Recent logs (ALL, API, QR-CODE, etc.)"
        echo "  bots              - Bot detection logs"
        echo "  summary           - Log statistics"
        echo "  monitor           - Live monitoring"
        echo ""
        echo "Examples:"
        echo "  $0 recent API     # Show recent API logs"
        echo "  $0 bots           # Show bot detection logs"
        echo "  $0 summary        # Show statistics"
        echo ""
        show_summary
        ;;
esac
