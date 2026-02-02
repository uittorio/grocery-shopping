# Recipory Architecture

## Recipe Data Schema

```json
{
  "id": "string (UUID)",
  "name": "string",
  "ingredients": [
    {
      "name": "string",
      "quantity": "number",
      "unit": "string"
    }
  ],
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### Example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Spaghetti Carbonara",
  "ingredients": [
    { "name": "spaghetti", "quantity": 400, "unit": "g" },
    { "name": "eggs", "quantity": 4, "unit": "whole" },
    { "name": "parmesan", "quantity": 100, "unit": "g" }
  ],
  "createdAt": "2026-02-02T10:30:00Z",
  "updatedAt": "2026-02-02T10:30:00Z"
}
```

### Schema Notes

- **id**: Generated UUID, not user-visible
- **ingredients**: Flat list. Quantities are numeric for potential aggregation. Units are free-text strings ("cloves", "g", "ml")
- **Extensibility**: Future fields (tags, servings, notes) can be added without breaking existing recipes
- **No cooking instructions**: MVP focuses on ingredients for shopping lists

---

## Project Folder Structure

```
recipory/
  src/
    domain/                  # Core business logic (pure, no dependencies)
      recipe.js              # Recipe entity and validation
      shoppingList.js        # Shopping list aggregation logic
      ports/
        recipeRepository.js  # Repository interface

    application/             # Use cases / orchestration
      createRecipe.js
      listRecipes.js
      searchRecipes.js
      getRecipe.js
      deleteRecipe.js
      generateShoppingList.js

    adapters/                # External interfaces
      storage/               # JSON file persistence
        jsonRecipeRepository.js
      ui/                    # React frontend
        components/
          RecipeList.jsx
          RecipeDetail.jsx
          RecipeForm.jsx
          WeeklyPlanner.jsx
          ShoppingList.jsx
        App.jsx
        index.jsx

    infrastructure/          # Setup, wiring, configuration
      container.js           # Dependency injection / wiring

  data/                      # JSON storage location
    recipes/
      *.json                 # One file per recipe

  tests/
    domain/
    application/
    adapters/

  package.json
```

### What goes where

- **domain/**: Pure business logic. No I/O, no React, no file system. Contains entities, domain services, and port definitions.
- **application/**: Use cases that orchestrate domain logic. Each file is one user action. These depend on domain and call through ports.
- **adapters/storage/**: JSON file repository implementing the RecipeRepository port.
- **adapters/ui/**: React components consuming application use cases.
- **infrastructure/**: Wires adapters to ports, creates instances, exposes to UI.
- **data/**: One JSON file per recipe. Simple, inspectable, version-control friendly.

---

## Port Definitions

### RecipeRepository Port

```javascript
// src/domain/ports/recipeRepository.js
class RecipeRepository {
  async save(recipe) {}
  async findById(id) {}
  async findAll() {}
  async search(query) {}
  async delete(id) {}
}
```

### Application Services

- **createRecipe(name, ingredients)**: Validates and saves a new recipe
- **listRecipes()**: Returns all recipes
- **searchRecipes(query)**: Returns recipes matching search term
- **getRecipe(id)**: Returns single recipe by ID
- **deleteRecipe(id)**: Removes a recipe
- **generateShoppingList(recipeIds)**: Aggregates ingredients from selected recipes, returns consolidated list

---

## Key Architectural Decisions

### 1. Ports and Adapters (Hexagonal Architecture)

The domain doesn't know about JSON files or React. Core logic is easy to test and adapters can be swapped (JSON today, SQLite tomorrow) without touching business logic.

### 2. One JSON File Per Recipe

Simple, inspectable, version-control friendly. No database needed for dozens of recipes. The RecipeRepository port makes it trivial to swap in a different storage mechanism later.

### 3. Flat Ingredient List

No nested categories or sections. Users can add "onion (large)" or "flour (plain)" as distinct ingredient names if needed.

### 4. No Cooking Instructions in MVP

The product goal is shopping list generation, not recipe execution. Instructions can be added later as a simple text field.

### 5. Weekly Selection as Transient State

Weekly recipe selection lives in React state. No need to persist to disk. If users want planning history later, this can be added.

### 6. Search as Simple String Matching

Case-insensitive substring match on recipe name and ingredient names. Proportionate for tens of recipes.

---

## Data Flow

### User creates a recipe

1. UI (RecipeForm) calls `createRecipe(name, ingredients)`
2. Application layer validates input, creates Recipe entity
3. Application calls `recipeRepository.save(recipe)` through port
4. Adapter (jsonRecipeRepository) writes JSON file to `data/recipes/{id}.json`
5. Returns saved recipe to UI

### User generates shopping list

1. UI (WeeklyPlanner) tracks selected recipe IDs in React state
2. User clicks "Generate Shopping List"
3. UI calls `generateShoppingList(recipeIds)`
4. Application layer fetches each recipe via `recipeRepository.findById(id)`
5. Domain service (shoppingList.js) aggregates ingredients
6. Returns ingredient list to UI
7. UI (ShoppingList) displays list with "Copy to Clipboard" button

---

## Testing Strategy (High-Level)

- **Domain**: Pure unit tests. No mocks needed (no I/O). Test Recipe entity validation, shopping list aggregation logic.
- **Application**: Unit tests with mocked RecipeRepository. Verify use case orchestration.
- **Adapters**: Integration tests. JSON repository tested against temp directory. React components tested with React Testing Library.

Detailed testing strategy per layer to be defined before implementation starts.
