# Recipory

A recipe management app for families — browse recipes, plan weekly meals, and generate shopping lists.

## Prerequisites

```bash
brew install fnm gitleaks
```

- **fnm** — Node version manager. Reads `.node-version` from the repo root and auto-switches. Add this to your shell profile (`~/.zshrc` or `~/.bashrc`):

  ```bash
  eval "$(fnm env --use-on-cd)"
  ```

  Then restart your shell. fnm will automatically install and switch to the correct Node version when you `cd` into the repo.

- **gitleaks** — pre-commit hook blocks commits containing secrets

## Getting Started

```bash
cd recipory
npm install        # also sets up git hooks via prepare script
npm run dev        # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite + Fastify server concurrently |
| `npm run server` | Fastify API server only |
| `npm run build` | Production build |
| `npm test` | Run tests (watch mode) |
| `npm run test:run:once` | Run tests once (CI) |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run test:e2e:headed` | E2E tests in visible browser |
| `npm run screenshots` | Regenerate screenshots via Playwright |

## Current Status

Increments 1–4 complete (Recipe Library, Add/Edit/Delete). Increment 5 (Weekly Shopping Flow) is next.
