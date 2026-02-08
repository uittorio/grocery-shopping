---
name: commit
description: Create a git commit with an auto-generated message
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep, Edit, Write, mcp__knip__knip-run
---

Create a git commit following these steps:

1. Run `git status` (never use -uall flag) and `git diff` to see all changes
2. Run `git log --oneline -5` to see recent commit message style
3. Run Knip (`mcp__knip__knip-run`) on `recipory/` to check for unused files, exports, and dependencies
   - If Knip finds issues: fix them (delete unused files, remove unused exports) before staging
   - Report what was cleaned up in the commit message
4. Stage all relevant changed files (prefer specific file names over `git add -A`)
5. Do NOT stage files that contain secrets (.env, credentials, etc.)
6. Always include `.prompts/history.md` if it has changes
7. Write a concise commit message that follows the existing style (conventional commits, focus on "why" not "what")
8. End the commit message with: `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`
9. Use a HEREDOC for the commit message
10. Run `git status` after to confirm success
11. Do NOT push
