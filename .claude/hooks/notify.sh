#!/bin/sh
# Cross-platform desktop notification for Claude Code
# macOS: osascript, Linux: notify-send
MESSAGE="${1:-Claude Code needs your attention}"

if [ "$(uname)" = "Darwin" ]; then
  osascript -e "display notification \"$MESSAGE\" with title \"Claude Code\""
else
  notify-send "Claude Code" "$MESSAGE"
fi
