#!/bin/bash

# Bot Detection Log Monitor
# This script helps monitor bot detection attempts

LOG_FILE="/home/awilliams/logs/theqrcode.log"

echo "🔍 Bot Detection Monitor"
echo "========================"
echo "Monitoring: $LOG_FILE"
echo "Press Ctrl+C to stop"
echo ""

# Function to show recent bot detection attempts
show_recent_bots() {
    echo "🚨 Recent Bot Detection Attempts (last 50 lines):"
    echo "----------------------------------------"
    grep -n "BOT-DETECTION" "$LOG_FILE" | tail -50
    echo ""
}

# Function to show bot detection summary
show_summary() {
    echo "📊 Bot Detection Summary:"
    echo "------------------------"
    echo "Total bot attempts: $(grep -c "Bot detected" "$LOG_FILE" 2>/dev/null || echo "0")"
    echo "OAuth bot attempts: $(grep -c "OAuth.*Bot detected" "$LOG_FILE" 2>/dev/null || echo "0")"
    echo "API bot attempts: $(grep -c "API.*Bot detected" "$LOG_FILE" 2>/dev/null || echo "0")"
    echo "Legitimate OAuth requests: $(grep -c "Legitimate OAuth request allowed" "$LOG_FILE" 2>/dev/null || echo "0")"
    echo ""
}

# Function to show real-time monitoring
monitor_realtime() {
    echo "👀 Real-time Bot Detection Monitoring:"
    echo "====================================="
    tail -f "$LOG_FILE" | grep --line-buffered "BOT-DETECTION"
}

# Main menu
case "${1:-menu}" in
    "recent")
        show_recent_bots
        ;;
    "summary")
        show_summary
        ;;
    "monitor"|"live")
        monitor_realtime
        ;;
    "menu"|*)
        echo "Usage: $0 [recent|summary|monitor|live]"
        echo ""
        echo "Commands:"
        echo "  recent  - Show recent bot detection attempts"
        echo "  summary - Show bot detection statistics"
        echo "  monitor - Real-time monitoring (live tail)"
        echo "  live    - Alias for monitor"
        echo ""
        show_summary
        ;;
esac
