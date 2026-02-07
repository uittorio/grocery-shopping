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

## Tech Stack

- JavaScript by default

## Conventions

- No time estimates in any documents. Focus on what needs doing, not how long it takes.

## Key Context

- This is a POC/personal tool for a single family, running locally on a trusted network
- The user is technical — no need for cloud hosting, auth flows, or onboarding simplification
- Tesco automation is the core value — a shopping list fallback is not acceptable

## Agents

Team agents live in `.claude/agents/`. See each file for role and scope:
- Designer, Product Owner, Architect, Software Engineer, User Persona, Mob Facilitator
