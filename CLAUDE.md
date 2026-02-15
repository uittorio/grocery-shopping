# Grocery Shopping

## Project

See `product/PRODUCT.md` for the full product description.

## Folder Structure

- `product/` — Product-facing documentation (PRODUCT.md, project overview)
- `discovery/` — Early-stage artifacts grouped per idea (e.g., `discovery/mvp/`)
  - `discovery/<idea>/ideas/` — Raw ideas and brainstorming output
  - `discovery/<idea>/working/` — Prototypes and transient artifacts
- `plan/` — Validated plans and PRDs ready for implementation
- `delivery/` — Delivery artifacts, release checklists, technical spikes
  - `delivery/<idea>/spikes/` — Technical spikes and feasibility experiments

## Conventions

- No time estimates in any documents. Focus on what needs doing, not how long it takes.
- Do NOT read image/screenshot files (PNG, JPG, etc.) — they are expensive in tokens. Only the `review-ux` skill should read screenshots.

## Key Context

- This is a POC/personal tool for a single family, running locally on a trusted network
- **Target hardware: Raspberry Pi (2 GB RAM)** — choose lightweight frameworks and minimal dependencies. Avoid heavy runtimes, large bundle sizes, and CPU-intensive tools. This applies to both backend (server) and build tooling choices.
- The user is technical — no need for cloud hosting, auth flows, or onboarding simplification

## Agents

Team agents live in `.claude/agents/`. See each file for role and scope:
- Designer, Product Owner, Architect, Software Engineer, User Persona, Mob Facilitator
