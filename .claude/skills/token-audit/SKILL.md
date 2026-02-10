---
name: token-audit
description: Audit the repo for token consumption improvements
allowed-tools: Bash, Read, Glob, Grep, WebSearch, WebFetch
---

Audit this repo's Claude Code token consumption and report actionable improvements.

## What to measure

Run these checks using Bash (wc -l) and Glob/Grep, then report findings in a table:

1. **CLAUDE.md files**: Line count for every `CLAUDE.md` in the repo. Flag any over 500 lines.
2. **Agent definitions**: Line count for each file in `.claude/agents/`. Total is always loaded as tool definitions.
3. **Skill definitions**: Line count for each SKILL.md/skill.md in `.claude/skills/`. Total is always loaded as tool definitions.
4. **MCP servers**: Read `.claude/settings.json` (project) and `~/.claude/settings.json` (user). List configured MCP servers. Each adds tool definitions to context even when idle.
5. **.claudeignore coverage**: Check if `.claudeignore` exists. List top-level directories and flag any large doc/artifact folders (discovery/, .prompts/, plan/, delivery/, screenshots/) that are NOT ignored. Count their total lines of .md files.
6. **Large files**: Find the 10 largest files by line count (excluding node_modules/, dist/, .git/, package-lock.json). Flag anything over 300 lines — Claude may read these in full.

## What to check qualitatively

7. **CLAUDE.md content**: Read each CLAUDE.md. Flag content that could be a skill instead (specialized workflows, long examples, step-by-step procedures used only in specific contexts).
8. **Hooks**: Read `.claude/settings.json` hooks. Note any that write large files Claude might read (e.g. prompt logs).

## How to report

Output a report with these sections:

### Context budget (loaded every session)
Table: source | lines | notes

### Findings
Numbered list of specific issues, each with:
- What the problem is
- Why it costs tokens
- Suggested fix

### Quick wins
Bulleted list of changes that can be made right now, ordered by impact.

## Research (optional)

If you find an area where best practices are unclear, use WebSearch to check current Claude Code documentation for guidance. Only search if needed — don't search for things already covered above.

## Rules

- Do NOT make any changes. This is a read-only audit.
- Be specific: quote file paths, line counts, and concrete suggestions.
- Skip anything that's already optimised — only report actionable findings.
