# Recipory - Walking Skeleton (Increment 1)

## What's Been Built

This is the walking skeleton for Recipory - a minimal end-to-end implementation that proves the architecture works.

### User-Visible Features
- A React app that loads in the browser
- Shows a hardcoded recipe ("Spaghetti Carbonara") with 3 ingredients in a basic list

### Technical Implementation

The walking skeleton implements hexagonal architecture with the following structure:

```
src/
├── domain/                      # Pure business logic
│   ├── recipe.js               # Recipe entity with validation
│   └── ports/
│       └── recipeRepository.js # Repository interface (port)
│
├── application/                # Use cases
│   └── listRecipes.js         # List all recipes use case
│
├── adapters/                   # External interfaces
│   ├── storage/
│   │   └── inMemoryRecipeRepository.js  # In-memory storage adapter
│   └── ui/
│       ├── components/
│       │   └── RecipeList.jsx  # Recipe list component
│       ├── App.jsx             # Main app shell
│       └── App.css             # Basic styling
│
└── main.jsx                    # Dependency injection and wiring
```

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests once (CI mode)
npm run test:run
```

## Architectural Validation

This increment validates the following architectural decisions:

1. **Hexagonal Architecture**: Domain layer has no I/O dependencies
2. **Port/Adapter Pattern**: Repository port is defined in domain, implemented by adapters
3. **Dependency Injection**: Use cases are created with dependencies injected at startup
4. **Pure Domain Logic**: Recipe entity validation is pure and fully testable
5. **Test Strategy**: Domain tests are pure unit tests with no mocks

## What's Next (Increment 2)

The next increment will:
- Replace `InMemoryRecipeRepository` with `JsonRecipeRepository`
- Create `data/recipes/` folder for JSON storage
- Validate that swapping adapters requires no domain or application changes
- Add integration tests for JSON persistence

## Key Files

- `/Users/vittorio.guerriero@ivcevidensia.com/w/repos/grocery-shopping/src/domain/recipe.js` - Recipe entity with business rules
- `/Users/vittorio.guerriero@ivcevidensia.com/w/repos/grocery-shopping/src/domain/ports/recipeRepository.js` - Repository port definition
- `/Users/vittorio.guerriero@ivcevidensia.com/w/repos/grocery-shopping/src/main.jsx` - Wiring and dependency injection
- `/Users/vittorio.guerriero@ivcevidensia.com/w/repos/grocery-shopping/tests/domain/recipe.test.js` - Domain unit tests

## Architectural Notes

The code includes inline comments explaining architectural decisions. Key patterns:

- **Domain entities are factories**: `createRecipe()` validates and constructs recipes
- **Ports are interfaces**: `RecipeRepository` class defines the contract
- **Adapters implement ports**: `InMemoryRecipeRepository` extends `RecipeRepository`
- **Use cases are functions**: `createListRecipes()` returns the use case function
- **UI receives use cases as props**: `<App listRecipes={listRecipes} />`

This approach keeps the domain independent of frameworks and makes the system easy to test and evolve.
