---
name: commit
description: Create a git commit with an auto-generated message
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep
---

Create a git commit following these steps:

1. Run `git status` (never use -uall flag) and `git diff` to see all changes
2. Run `git log --oneline -5` to see recent commit message style
3. Stage all relevant changed files (prefer specific file names over `git add -A`)
4. Do NOT stage files that contain secrets (.env, credentials, etc.)
5. Always include `.prompts/history.md` if it has changes
6. Write a concise commit message that follows the existing style (conventional commits, focus on "why" not "what")
7. End the commit message with: `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`
8. Use a HEREDOC for the commit message
9. Run `git status` after to confirm success
10. Do NOT push
