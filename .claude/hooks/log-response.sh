#!/bin/bash
# Logs an Ollama-generated summary of Claude's last response to .prompts/history.md
#
# --- Local Ollama setup ---
# This hook requires Ollama running locally:
#   brew install ollama
#   ollama serve              # starts the API on http://localhost:11434
#   ollama pull gemma3:1b     # ~800 MB download
#
# To use a different model, change OLLAMA_MODEL below.
# Available models: ollama list
# If Ollama is not running, the hook falls back to truncating the response.

LOG_FILE="$(dirname "$0")/../../.prompts/history.md"
OLLAMA_MODEL="qwen3:8b"
OLLAMA_URL="http://localhost:11434/api/generate"

SKIP_FLAG="$(dirname "$0")/../../.prompts/.skip-response"

# Skip if the prompt hook flagged this as a commit/push command
if [ -f "$SKIP_FLAG" ]; then
  rm -f "$SKIP_FLAG"
  exit 0
fi

INPUT=$(cat)
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  exit 0
fi

# Extract last assistant text from JSONL transcript
# Transcript entries use .type for role and .message.content for content blocks
RESPONSE_TEXT=$(jq -rs '
  [.[] | select(.type == "assistant") | select(any(.message.content[]?; .type == "text"))]
  | last
  | [.message.content[]? | select(.type == "text") | .text]
  | join(" ")
' "$TRANSCRIPT_PATH" 2>/dev/null)

if [ -z "$RESPONSE_TEXT" ]; then
  exit 0
fi

# Summarise via local Ollama
PROMPT="Summarise the following in a couple of short sentences. Only output the summary, nothing else.\n\n${RESPONSE_TEXT}"

SUMMARY=$(curl -sf "$OLLAMA_URL" \
  -d "$(jq -n --arg model "$OLLAMA_MODEL" --arg prompt "$PROMPT" \
    '{model: $model, prompt: $prompt, stream: false}')" \
  2>/dev/null | jq -r '.response // empty' 2>/dev/null)

# Fall back to truncation if Ollama is unavailable
if [ -z "$SUMMARY" ]; then
  SUMMARY=$(echo "$RESPONSE_TEXT" | cut -c1-200)
  [ ${#RESPONSE_TEXT} -gt 200 ] && SUMMARY="${SUMMARY}..."
fi

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

{
  echo "**Claude** (${TIMESTAMP}):"
  echo "$SUMMARY"
  echo ""
  echo "---"
  echo ""
} >> "$LOG_FILE"

exit 0
