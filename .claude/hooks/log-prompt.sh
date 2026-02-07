#!/bin/bash
# Logs every user prompt to .prompts/history.md with timestamp
# Skips logging for commit/push commands (skill invocations or plain text)

LOG_FILE="$(dirname "$0")/../../.prompts/history.md"
SKIP_FLAG="$(dirname "$0")/../../.prompts/.skip-response"

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Skip system-generated notifications (e.g. background task killed)
if echo "$PROMPT" | grep -q '<task-notification>'; then
  exit 0
fi

# Skip commit/push commands
NORMALISED=$(echo "$PROMPT" | tr '[:upper:]' '[:lower:]' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
case "$NORMALISED" in
  /commit|/push|commit|push|"commit and push"|"commit & push")
    touch "$SKIP_FLAG"
    exit 0
    ;;
esac
rm -f "$SKIP_FLAG"

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
