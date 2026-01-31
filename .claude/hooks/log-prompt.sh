#!/bin/bash
# Logs every user prompt to .prompts/history.md with timestamp

LOG_FILE="$(dirname "$0")/../../.prompts/history.md"

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Create file with header if it doesn't exist
if [ ! -f "$LOG_FILE" ]; then
  echo "# Session History" > "$LOG_FILE"
  echo "" >> "$LOG_FILE"
fi

{
  echo "**Me** (${TIMESTAMP}):"
  echo "$PROMPT"
  echo ""
  echo "---"
  echo ""
} >> "$LOG_FILE"

exit 0
