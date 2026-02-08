---
name: review-ux
description: Run E2E tests, capture screenshots, and get Designer + User Persona review
allowed-tools: Bash, Read, Glob, Grep, Task
---

Review the app's user experience by generating fresh screenshots and having agents evaluate them:

1. Run E2E tests with screenshot capture: `npm run test:e2e --prefix recipory`
2. If any E2E tests fail, report the failures and stop
3. Read all generated screenshots from `recipory/screenshots/` using the Read tool (they are image files)
4. Ask the **Designer** agent (via Task tool, subagent_type: designer) to review the screenshots for:
   - Visual consistency and hierarchy
   - Accessibility concerns
   - Mobile responsiveness
   - Alignment with the design spec at `discovery/recipory/DESIGN_SPEC.md`
5. Ask the **User Persona** agent (via Task tool, subagent_type: user-persona) to review the screenshots for:
   - First impressions and clarity
   - Whether flows feel intuitive
   - Pain points or confusing elements
   - Whether it works for a busy parent on a phone
6. Summarise findings from both agents, grouped by priority (must-fix / should-fix / nice-to-have)
