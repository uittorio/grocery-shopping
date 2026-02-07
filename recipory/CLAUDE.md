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
- **Testing**: Vitest, @testing-library/react, jsdom
- **Language**: TypeScript (ES modules)

## Architecture: Hexagonal

The codebase follows hexagonal (ports & adapters) architecture. The domain has zero dependencies on frameworks or I/O.

```
src/
├── domain/           # Pure business logic, no imports from outside domain
│   ├── recipe.ts     # Entity factory: createRecipe() validates and returns a plain object
│   └── ports/        # Interfaces that adapters must implement
│       └── recipeRepository.ts
│
├── application/      # Use cases: orchestrate domain through ports
│   └── listRecipes.ts  # Factory: createListRecipes(repo) -> async function
│
├── adapters/         # Implementations of ports + UI
│   ├── storage/      # Persistence adapters (implement port interfaces)
│   │   └── inMemoryRecipeRepository.ts
│   └── ui/           # React components
│       ├── App.tsx
│       └── components/
│
└── main.tsx          # Composition root: wires adapters -> use cases -> UI
```

### Rules

- **Domain** depends on nothing. No imports from `adapters/`, `application/`, or libraries.
- **Application** depends on domain only. Receives adapters via dependency injection.
- **Adapters** depend on domain ports. They implement the interfaces defined in `domain/ports/`.
- **main.tsx** is the composition root — the only place that knows about all layers.

### Patterns

- **Entities are factory functions**: `createRecipe(data)` validates and returns a typed plain object. No classes.
- **Ports are TypeScript interfaces**: e.g. `interface RecipeRepository` defines the contract.
- **Adapters implement ports**: e.g. `InMemoryRecipeRepository implements RecipeRepository`.
- **Use cases are factory functions**: `createListRecipes(repo)` returns a typed async function.
- **UI receives use cases as props**: components never import adapters or domain directly.

## Code Style

- **No unnecessary comments.** The code should be self-explanatory. Only add comments for genuinely complex algorithms or non-obvious business decisions.
- No JSDoc on functions — TypeScript types serve as documentation.

## Testing

### Approach

- **TDD**: Write the test first, then make it pass, then refactor.
- **Test behaviour, not implementation**: Assert on outputs and side effects, not internal state.

### Test levels

| Level | Location | What to test | Mocks allowed |
|-------|----------|-------------|---------------|
| Domain unit | `tests/domain/` | Entity validation, business rules | None — pure functions |
| Application unit | `tests/application/` | Use case orchestration | Ports only (in-memory fakes) |
| Adapter integration | `tests/adapters/` | Storage/UI adapters work correctly | External I/O only |

### Conventions

- Mirror `src/` structure under `tests/`: `src/domain/recipe.ts` -> `tests/domain/recipe.test.ts`
- Use `describe` for the unit, nested `describe` for the method/behaviour, `it` for each case.
- Import from vitest explicitly: `import { describe, it, expect } from 'vitest'`
- No `beforeEach` for simple data setup — inline it in each test for readability.
