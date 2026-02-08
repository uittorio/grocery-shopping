# Recipory -- Technical Guide

## Current Status

**Increments 1–4 complete. Increment 5 (Weekly Shopping Flow) is next.**

Implemented: Recipe Library, Add/Edit/Delete Recipe, Fastify backend, file-based storage, integration tests, E2E tests with screenshots.

Not yet implemented (planned for Increment 5): "Plan Shopping" button, recipe selection screen, shopping list screen, copy-to-clipboard, search bar. See `discovery/recipory/DELIVERY_PLAN.md` for full scope.

## Commands

All commands run from `recipory/`.

```bash
npm run dev            # Runs both Vite (http://localhost:5173) and Fastify server (http://localhost:3001) concurrently
npm run server         # Fastify API server only
npm test               # Vitest in watch mode
npm run test:run:once       # Vitest single run (use for CI / verification)
npm run test:e2e       # Playwright E2E tests (starts dev:test server automatically)
npm run test:e2e:headed  # Playwright E2E tests in headed browser (visible)
npm run screenshots    # Regenerate screenshots via Playwright
npm run build          # Production build (frontend only)
```

## Stack

- **UI**: React 19, Vite 7, React Router v7
- **Backend**: Fastify (TypeScript, runs via tsx)
- **Data Fetching**: TanStack Query v5
- **Testing**: Vitest, @testing-library/react, @testing-library/user-event, jsdom, MSW, Playwright (E2E)
- **Language**: TypeScript (ES modules)

## Architecture

The codebase is split into three top-level folders: `shared/` (contract types), `ui/` (React frontend), and `server/` (Fastify backend). The HTTP API is the boundary between UI and server. Ports are a UI concern (they define what the UI needs); the server just uses the shared `Recipe` type.

```
shared/                          # Contract: types + validation only
└── recipe.ts                    # Recipe, Ingredient, RecipeValidationErrors, validateRecipe, hasValidationErrors, generateRecipeId

ui/
├── adapters/                    # HTTP adapters (browser-side, calls API)
│   ├── httpRecipeReader.ts      # Implements RecipeReader
│   └── httpRecipeWriter.ts      # Implements RecipeWriter
├── recipes/                     # Feature folder (components, hooks, ports)
│   ├── ports/
│   │   ├── recipeReader.ts      # Read-only operations interface
│   │   └── recipeWriter.ts      # Write operations interface
│   ├── RecipeLibrary.tsx        # Recipe list page (loading, error, data)
│   ├── EditRecipe.tsx           # Edit recipe page (fetch + form)
│   ├── RecipeList.tsx
│   ├── RecipeForm.tsx
│   ├── useRecipes.ts
│   ├── useRecipe.ts
│   ├── useCreateRecipe.ts
│   ├── useUpdateRecipe.ts
│   └── useDeleteRecipe.ts
├── App.tsx
├── App.css
└── main.tsx                     # Composition root

server/
├── adapters/
│   └── fileRecipeRepository.ts  # Reads/writes JSON files
├── routes/
│   └── recipes.ts               # Recipe CRUD route handlers
└── index.ts                     # Server setup + start

data/
└── recipes/                     # JSON file storage (server reads/writes here)
    ├── index.json               # Array of recipe IDs
    └── {id}.json                # One file per recipe
```

### Rules

- **Shared** contains only types and pure validation functions. No imports from `ui/` or `server/`.
- **UI** imports from `shared/` for types. Ports live inside the feature folder (they define what the UI needs from its adapters).
- **Server** imports from `shared/` for the `Recipe` type. No dependency on UI ports -- the HTTP API is the real contract.
- **main.tsx** is the composition root -- the only place that knows about all layers.

### Patterns

- **Ports are TypeScript interfaces** (UI concern): e.g. `RecipeReader`, `RecipeWriter` define what the UI adapters must provide.
  - **Interface segregation**: Read-only operations live in `RecipeReader`, write operations in `RecipeWriter`.
- **HTTP adapters implement ports**: e.g. `HttpRecipeReader implements RecipeReader`.
- **Server adapters use shared types directly**: `FileRecipeRepository` uses the `Recipe` type from `shared/` without implementing UI port interfaces.
- **UI uses TanStack Query hooks**: components fetch data via `useRecipes()` hook, mutations via `useCreateRecipe()`.

### API Endpoints

- `GET /api/recipes` -- returns all recipes as JSON array
- `GET /api/recipes/:id` -- returns single recipe
- `POST /api/recipes` -- creates recipe, returns 201 with saved recipe
- `PUT /api/recipes/:id` -- updates recipe, returns updated recipe (404 if not found)
- `DELETE /api/recipes/:id` -- deletes recipe, returns 204 (404 if not found)

Vite proxies `/api/*` requests to the Fastify server at `http://localhost:3001` during development.

### Routing

React Router v7 handles client-side routing:
- `/` -- Recipe Library (RecipeList)
- `/recipes/new` -- Add Recipe (RecipeForm)
- `/recipes/:id/edit` -- Edit Recipe (RecipeForm in edit mode)

## Code Style

- **No unnecessary comments.** The code should be self-explanatory. Only add comments for genuinely complex algorithms or non-obvious business decisions.
- No JSDoc on functions -- TypeScript types serve as documentation.

## Testing

### Philosophy

Test the system **from the user's perspective**, as close to production behaviour as possible. Write tests that would catch real bugs users would encounter.

### Strategy

- **TanStack Query** handles data fetching in the UI
- **MSW** intercepts HTTP requests in tests and returns mock data
- **Fastify + JSON files** serve as the real data source in production
- Tests render the actual UI components with real query hooks
- No mocking of React Query or component internals

### Key principle

**Test behaviour, not implementation.** Assert on what the user sees (DOM content), not on component state, props, or function calls.

### Approach

- **TDD**: Write the test first, then make it pass, then refactor.
- **Integration over unit**: Prefer tests that exercise multiple layers together.
- **User-centric assertions**: Use `screen.findByText()` and similar queries that match how users interact with the app.

### Test levels

| Level | Location | What to test | Mocks allowed |
|-------|----------|-------------|---------------|
| E2E | `tests/e2e/` | Full stack: real browser, real server, real file storage | None -- real system |
| UI integration | `tests/recipes/` | Full user flows: render app, see data on page | HTTP only (via MSW) |
| Domain unit (fallback) | `tests/shared/` | Only when behaviour can't be tested at integration level | None -- pure functions |

### Conventions

- Organise tests by feature under `tests/` (e.g. `tests/recipes/`)
- Use `describe` for the unit, nested `describe` for the method/behaviour, `it` for each case.
- Import from vitest explicitly: `import { describe, it, expect } from 'vitest'`
- No `beforeEach` for simple data setup -- inline it in each test for readability.
- Use `MemoryRouter` (not BrowserRouter) in tests for routing.
- Use `@testing-library/user-event` for user interactions.

### MSW setup

MSW (Mock Service Worker) intercepts HTTP requests at the network level. Tests make real `fetch()` calls, but MSW returns mock data instead of hitting the network.

- **Handlers** live in `tests/mocks/handlers.ts` -- define mock responses for each API endpoint
- **Server** setup in `tests/mocks/server.ts` -- creates the MSW server instance
- **Setup file** at `tests/setup.ts` -- starts/stops the server around all tests, resets mock data between tests

### Example test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '../../ui/App.js';

it('displays recipes when loaded', async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <MemoryRouter initialEntries={['/']}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Spaghetti Carbonara')).toBeInTheDocument();
});
```

### E2E tests (Playwright)

E2E tests run a real browser against the full stack (Vite + Fastify + file storage). They verify that the entire system works end-to-end.

**Relationship to integration tests**: Integration tests (Vitest + MSW) are fast and mock the HTTP layer. E2E tests are slower but exercise the real server and file system. Both levels complement each other.

**Test data strategy**:
- Seed fixtures live in `tests/e2e/fixtures/recipes/`
- Before each test, fixtures are copied to `data/test-recipes/`
- The server reads from `data/test-recipes/` via `RECIPE_DATA_DIR` env var
- This gives each test a clean, predictable starting state

**Screenshot capture**: Tests capture screenshots to `screenshots/`. This directory is gitignored. Run `npm run screenshots` to regenerate all screenshots.

**Config**: `playwright.config.ts` at the project root. Only Chromium is configured (lightweight for Raspberry Pi).

**Structure**:
```
tests/e2e/
├── fixtures/
│   └── recipes/        # Seed data copied before each test
│       ├── index.json
│       ├── e2e-carbonara-001.json
│       └── e2e-tikka-002.json
├── helpers/
│   └── resetTestData.ts  # Copies fixtures to data/test-recipes/
├── recipes.spec.ts     # Core CRUD flows + screenshots
└── mobile.spec.ts      # Mobile viewport tests + screenshots
```
