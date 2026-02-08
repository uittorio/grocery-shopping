# Recipory Incremental Delivery Plan

**Version**: 1.0
**Date**: 2026-02-02
**Status**: For Review

## Overview

This plan delivers Recipory in 5 small, shippable increments. Each increment is a working vertical slice the user can demo. The sequence balances early user value with technical validation of the hexagonal architecture.

---

## Increment 1: Walking Skeleton

**What it delivers (user-visible)**:
- A React app loads in the browser
- Shows a hardcoded recipe (name + 3 ingredients) in a basic list

**What it builds (technical)**:
- Project structure (folders per ARCHITECTURE.md)
- Domain: Recipe entity with validation
- Application: listRecipes() use case
- Adapter: In-memory repository (hardcoded data)
- UI: Minimal RecipeList component
- Basic test for Recipe entity

**Acceptance criteria**:
- User opens the app and sees "Spaghetti Carbonara" with 3 ingredients
- Domain tests pass
- Code follows hexagonal architecture (domain has no I/O dependencies)

**Rationale**:
- *Programmer*: Proves the stack works end-to-end before investing in persistence
- *Architect*: Validates hexagonal architecture with a vertical slice
- *Product Owner*: Users see recipes immediately, building confidence
- *User Persona*: "I can see where my recipes will live"

---

## Increment 2: JSON Persistence

**What it delivers (user-visible)**:
- Recipe data now comes from real JSON files
- Data persists across app reloads

**What it builds (technical)**:
- Adapter: JSON file repository (implements RecipeRepository port)
- Create data/recipes/ folder
- Write 2-3 example recipe JSON files
- Wire JSON repository into the app (replace in-memory adapter)

**Acceptance criteria**:
- User reloads the app and still sees the same recipes
- JSON files are readable and editable by hand
- Repository tests pass (unit + integration)

**Rationale**:
- *Architect*: Validates storage adapter; port abstraction proven
- *Programmer*: Small increment (just swap adapters); testable
- *Product Owner*: Data persistence is required before users can add recipes

---

## Increment 3: Recipe Library + Add Recipe

**What it delivers (user-visible)**:
- Full Recipe Library screen (Screen 1 from DESIGN_SPEC)
- "Add Recipe" button opens Recipe Detail screen
- User can create a new recipe (name + ingredients) and save it
- New recipe appears in the library immediately

**What it builds (technical)**:
- Application: createRecipe() use case
- Domain: Recipe validation (name required, at least 1 ingredient)
- UI: RecipeForm component with ingredient rows
- UI: "Add Recipe" button and routing to Recipe Detail screen
- Update RecipeList to show all recipes from storage
- Tests for createRecipe use case

**Acceptance criteria**:
- User clicks "Add Recipe", enters name and 2 ingredients, clicks Save
- New recipe appears in Recipe Library
- Recipe is saved to data/recipes/{id}.json
- Validation errors show if name is missing or no ingredients

**Rationale**:
- *Product Owner*: Users can now build their recipe library (core value prop)
- *Designer*: Recipe Library (hub) and Recipe Detail (CRUD) are both functional
- *User Persona*: "I can add my own recipes - this is actually useful now"
- *Programmer*: Builds on existing architecture; straightforward CRUD

---

## Increment 4: Edit + Delete Recipe

**What it delivers (user-visible)**:
- Tap a recipe card to edit it
- Add/remove ingredients, change name
- Delete a recipe (with confirmation)

**What it builds (technical)**:
- Application: updateRecipe(), deleteRecipe() use cases
- UI: Edit mode for RecipeForm (populate existing data)
- UI: Delete button with confirmation dialog
- UI: Navigation from recipe card to edit screen
- Tests for update and delete use cases

**Acceptance criteria**:
- User taps recipe card, edits ingredients, saves - changes persist
- User deletes a recipe - removed from library and JSON file deleted
- Cancel button returns without saving changes

**Rationale**:
- *Product Owner*: Full library management (table stakes)
- *Designer*: Completes Flow 3 (Edit Existing Recipe) from DESIGN_SPEC
- *User Persona*: "I can fix typos and remove recipes I don't cook anymore"
- *Programmer*: Small increment (reuses RecipeForm component)

---

## Increment 5: Weekly Shopping Flow

**What it delivers (user-visible)**:
- "Plan Shopping" button on Recipe Library
- Screen 3a: Select recipes with checkboxes, see selection summary
- Screen 3b: Combined shopping list from selected recipes
- "Copy to Clipboard" copies plain text list
- Remove ingredients before copying

**What it builds (technical)**:
- Application: generateShoppingList(recipeIds) use case
- Domain: Shopping list aggregation logic (no quantity aggregation in MVP)
- UI: WeeklyPlanner component (recipe selection with checkboxes)
- UI: ShoppingList component (ingredient list with remove buttons)
- UI: Clipboard API integration
- Tests for shopping list generation logic

**Acceptance criteria**:
- User selects 2 recipes, clicks "Generate Shopping List"
- Sees combined ingredient list (duplicates not merged)
- Removes one ingredient, clicks "Copy to Clipboard"
- Pastes into Notes app - plain text list appears
- Confirmation toast shows "Copied!"

**Rationale**:
- *Product Owner*: Core value prop delivered - plan weekly shopping
- *Designer*: Completes Flow 2 - both screens 3a and 3b needed together
- *User Persona*: "This is what I came for - I can plan my shopping now"
- *Architect*: Validates domain service (shopping list aggregation)
- *Programmer*: Shopping list is transient state; clean separation

---

## Technical Dependencies

### Sequential (hard dependencies):
1. Increment 1 before 2 (need structure before persistence)
2. Increment 2 before 3 (need persistence before CRUD)
3. Increment 3 before 4 (need create before edit)
4. Increment 3 before 5 (need recipes before shopping list)

### Parallel opportunities:
- Increments 4 and 5 can be built in parallel after Increment 3

---

## Out of Scope (Explicitly Deferred)

- Search recipes (not critical for MVP - add after Increment 5)
- Ingredient aggregation (DESIGN_SPEC defers to v1.1)
- Recipe tags or categories
- Cooking instructions
- Servings tracking

---

## Agent Contributions

| Agent | Contribution |
|-------|-------------|
| Product Owner | Feature ordering for early user value, acceptance criteria |
| Architect | Hexagonal architecture validation strategy, adapter sequencing |
| Programmer | Vertical slice approach, test strategy, increment sizing |
| Designer | Empty states, accessibility requirements, flow completion dependencies |
| User Persona | User value validation, confidence-building moments |

No conflicts identified. All agents aligned on starting with recipe library, validating architecture early, and keeping increments small.
