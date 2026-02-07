# Recipory — Technical Guide

## Commands

All commands run from `recipory/`.

```bash
npm run dev        # Dev server at http://localhost:5173
npm test           # Vitest in watch mode
npm run test:run   # Vitest single run (use for CI / verification)
npm run build      # Production build
```

## Stack

- **UI**: React 19, Vite 7
- **Data Fetching**: TanStack Query v5
- **Testing**: Vitest, @testing-library/react, jsdom, MSW
- **Language**: TypeScript (ES modules)

## Architecture: Hexagonal

The codebase follows hexagonal (ports & adapters) architecture. The domain has zero dependencies on frameworks or I/O.

```
src/
├── domain/           # Pure business logic, no imports from outside domain
│   ├── recipe.ts     # Entity factory: createRecipe() validates and returns a plain object
│   └── ports/        # Interfaces that adapters must implement
│       ├── recipeReader.ts    # Read-only operations
│       ├── recipeWriter.ts    # Write operations
│       └── recipeRepository.ts  # Combines reader + writer
│
├── application/      # Use cases: orchestrate domain through ports
│   └── listRecipes.ts  # Factory: createListRecipes(repo) -> async function
│
├── adapters/         # Implementations of ports + UI
│   ├── storage/      # Persistence adapters (implement port interfaces)
│   │   └── inMemoryRecipeRepository.ts
│   ├── http/         # HTTP adapters for external APIs
│   │   ├── httpRecipeReader.ts  # Implements RecipeReader
│   │   └── recipesApi.ts
│   └── ui/           # React components
│       ├── App.tsx
│       ├── hooks/
│       │   └── useRecipes.ts
│       └── components/
│           └── RecipeList.tsx
│
├── main.tsx          # Composition root: wires QueryClientProvider and App
│
└── public/           # Static files served by Vite
    └── data/
        └── recipes.json  # Hardcoded recipe data
```

### Rules

- **Domain** depends on nothing. No imports from `adapters/`, `application/`, or libraries.
- **Application** depends on domain only. Receives adapters via dependency injection.
- **Adapters** depend on domain ports. They implement the interfaces defined in `domain/ports/`.
- **main.tsx** is the composition root — the only place that knows about all layers.

### Patterns

- **Entities are factory functions**: `createRecipe(data)` validates and returns a typed plain object. No classes.
- **Ports are TypeScript interfaces**: e.g. `interface RecipeRepository` defines the contract.
  - **Interface segregation**: Read-only operations live in `RecipeReader`, write operations in `RecipeWriter`. The full `RecipeRepository` extends both.
- **Adapters implement ports**: e.g. `InMemoryRecipeRepository implements RecipeRepository`, `HttpRecipeReader implements RecipeReader`.
- **Use cases are factory functions**: `createListRecipes(repo)` returns a typed async function.
- **UI uses TanStack Query hooks**: components fetch data via `useRecipes()` hook, not via props.

## Code Style

- **No unnecessary comments.** The code should be self-explanatory. Only add comments for genuinely complex algorithms or non-obvious business decisions.
- No JSDoc on functions — TypeScript types serve as documentation.

## Testing

### Philosophy

Test the system **from the user's perspective**, as close to production behaviour as possible. Write tests that would catch real bugs users would encounter.

### Strategy

- **TanStack Query** handles data fetching in the UI
- **MSW** intercepts HTTP requests in tests and returns mock data
- **JSON file** serves as the real data source (in `public/data/recipes.json`)
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
| Domain unit (fallback) | `tests/domain/` | Only when behaviour can't be tested at integration level | None — pure functions |

### Conventions

- Mirror `src/` structure under `tests/`
- Use `describe` for the unit, nested `describe` for the method/behaviour, `it` for each case.
- Import from vitest explicitly: `import { describe, it, expect } from 'vitest'`
- No `beforeEach` for simple data setup — inline it in each test for readability.

### MSW setup

MSW (Mock Service Worker) intercepts HTTP requests at the network level. Tests make real `fetch()` calls, but MSW returns mock data instead of hitting the network.

- **Handlers** live in `tests/mocks/handlers.ts` — define mock responses for each endpoint
- **Server** setup in `tests/mocks/server.ts` — creates the MSW server instance
- **Setup file** at `tests/setup.ts` — starts/stops the server around all tests

### Example test

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '../../../src/adapters/ui/App.js';

it('displays recipes when loaded', async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  expect(await screen.findByText('Spaghetti Carbonara')).toBeInTheDocument();
});
```
