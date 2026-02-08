# Recipory -- Technical Guide

## Commands

All commands run from `recipory/`.

```bash
npm run dev        # Runs both Vite (http://localhost:5173) and Fastify server (http://localhost:3001) concurrently
npm run server     # Fastify API server only
npm test           # Vitest in watch mode
npm run test:run   # Vitest single run (use for CI / verification)
npm run build      # Production build (frontend only)
```

## Stack

- **UI**: React 19, Vite 7, React Router v7
- **Backend**: Fastify (TypeScript, runs via tsx)
- **Data Fetching**: TanStack Query v5
- **Testing**: Vitest, @testing-library/react, @testing-library/user-event, jsdom, MSW
- **Language**: TypeScript (ES modules)

## Architecture: Hexagonal

The codebase follows hexagonal (ports & adapters) architecture. The domain has zero dependencies on frameworks or I/O.

```
src/
├── domain/           # Pure business logic, no imports from outside domain
│   ├── recipe.ts     # Recipe/Ingredient types, validation, ID generation
│   └── ports/        # Interfaces that adapters must implement
│       ├── recipeReader.ts    # Read-only operations
│       └── recipeWriter.ts    # Write operations
│
├── adapters/         # Implementations of ports + UI
│   ├── http/         # HTTP adapters (browser-side, calls API)
│   │   ├── httpRecipeReader.ts  # Implements RecipeReader
│   │   └── httpRecipeWriter.ts  # Implements RecipeWriter
│   ├── server/       # Server-side adapters
│   │   └── fileRecipeRepository.ts  # Reads/writes JSON files (implements RecipeReader + RecipeWriter)
│   └── ui/           # React components
│       ├── App.tsx
│       ├── hooks/
│       │   ├── useRecipes.ts
│       │   └── useCreateRecipe.ts
│       └── components/
│           ├── RecipeList.tsx
│           └── RecipeForm.tsx
│
├── server/           # Fastify server
│   ├── index.ts      # Server setup + start
│   └── routes/
│       └── recipes.ts  # Recipe CRUD route handlers
│
└── main.tsx          # Composition root: wires BrowserRouter, QueryClientProvider, and App

data/
└── recipes/          # JSON file storage (server reads/writes here)
    ├── index.json    # Array of recipe IDs
    └── {id}.json     # One file per recipe
```

### Rules

- **Domain** depends on nothing. No imports from `adapters/`, `application/`, or libraries.
- **Application** depends on domain only. Receives adapters via dependency injection.
- **Adapters** depend on domain ports. They implement the interfaces defined in `domain/ports/`.
- **main.tsx** is the composition root -- the only place that knows about all layers.

### Patterns

- **Entities are factory functions**: `createRecipe(data)` validates and returns a typed plain object. No classes.
- **Ports are TypeScript interfaces**: e.g. `interface RecipeRepository` defines the contract.
  - **Interface segregation**: Read-only operations live in `RecipeReader`, write operations in `RecipeWriter`. The full `RecipeRepository` extends both.
- **Adapters implement ports**: e.g. `FileRecipeRepository implements RecipeReader, RecipeWriter`, `HttpRecipeReader implements RecipeReader`.
- **Use cases are factory functions**: `createListRecipes(repo)` returns a typed async function.
- **UI uses TanStack Query hooks**: components fetch data via `useRecipes()` hook, mutations via `useCreateRecipe()`.

### API Endpoints

- `GET /api/recipes` -- returns all recipes as JSON array
- `GET /api/recipes/:id` -- returns single recipe
- `POST /api/recipes` -- creates recipe, returns 201 with saved recipe

Vite proxies `/api/*` requests to the Fastify server at `http://localhost:3001` during development.

### Routing

React Router v7 handles client-side routing:
- `/` -- Recipe Library (RecipeList)
- `/recipes/new` -- Add Recipe (RecipeForm)

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
| UI integration | `tests/adapters/ui/` | Full user flows: render app, see data on page | HTTP only (via MSW) |
| Domain unit (fallback) | `tests/domain/` | Only when behaviour can't be tested at integration level | None -- pure functions |

### Conventions

- Mirror `src/` structure under `tests/`
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
import { App } from '../../../src/adapters/ui/App.js';

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
