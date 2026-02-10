# Recipory Incremental Delivery Plan

**Version**: 3.0
**Date**: 2026-02-10
**Status**: In Progress (Increments 1-4 complete)

## Overview

This plan delivers Recipory in 5 small, shippable increments. Each increment is a working vertical slice the user can demo. The sequence balances early user value with technical validation of the hexagonal architecture.

---

## Increment 1: Walking Skeleton — COMPLETE

**What it delivers (user-visible)**:
- A React app loads in the browser
- Shows recipes from static JSON files in a basic list

**What it builds (technical)**:
- Project structure with hexagonal architecture
- Domain: Recipe and Ingredient type definitions
- Port: RecipeReader interface (read-only operations)
- Adapter: HttpRecipeReader fetches from static JSON via HTTP
- UI: RecipeList component with TanStack Query integration
- Integration test that renders UI and asserts on DOM content

**Acceptance criteria**:
- User opens the app and sees "Spaghetti Carbonara" with 3 ingredients
- Integration tests pass
- Code follows hexagonal architecture (domain has no I/O dependencies)

**Rationale**:
- *Programmer*: Proves the stack works end-to-end with realistic data fetching
- *Architect*: Validates hexagonal architecture with a vertical slice
- *Product Owner*: Users see recipes immediately, building confidence
- *User Persona*: "I can see where my recipes will live"

---

## Increment 2: JSON Data Loading — COMPLETE

**What it delivers (user-visible)**:
- Recipe data comes from individual JSON files
- Data persists across app reloads

**What it builds (technical)**:
- Individual recipe files in `public/data/recipes/{id}.json`
- Index file at `public/data/recipes/index.json`
- HttpRecipeReader fetches index, then individual recipes

**Acceptance criteria**:
- User reloads the app and still sees the same recipes
- JSON files are readable and editable by hand
- Integration tests pass

**Rationale**:
- *Architect*: Validates HTTP adapter; port abstraction proven
- *Programmer*: Static JSON served by Vite; testable via MSW
- *Product Owner*: Data persistence is required before users can add recipes

---

## Increment 3: Recipe Library + Add Recipe

**What it delivers (user-visible)**:
- Full Recipe Library screen (Screen 1 from DESIGN_SPEC)
- "Add Recipe" button opens Recipe Detail screen
- User can create a new recipe (name + ingredients) and save it
- New recipe appears in the library immediately

**What it builds (technical)**:
- Domain: Recipe validation logic (name required, at least 1 ingredient)
- Port: RecipeWriter interface (create operation)
- UI: RecipeForm component with ingredient rows
- UI: "Add Recipe" button and routing to Recipe Detail screen
- Integration tests for the full create flow

**Acceptance criteria**:
- User clicks "Add Recipe", enters name and 2 ingredients, clicks Save
- New recipe appears in Recipe Library
- Recipe is saved to `data/recipes/{id}.json`
- Validation errors show if name is missing or no ingredients
- Integration tests pass

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
- Port: RecipeWriter update and delete operations
- UI: Edit mode for RecipeForm (populate existing data)
- UI: Delete button with confirmation dialog
- UI: Navigation from recipe card to edit screen
- Integration tests for edit and delete flows

**Acceptance criteria**:
- User taps recipe card, edits ingredients, saves — changes persist
- User deletes a recipe — removed from library and JSON file deleted
- Cancel button returns without saving changes
- Integration tests pass

**Rationale**:
- *Product Owner*: Full library management (table stakes)
- *Designer*: Completes Flow 3 (Edit Existing Recipe) from DESIGN_SPEC
- *User Persona*: "I can fix typos and remove recipes I don't cook anymore"
- *Programmer*: Small increment (reuses RecipeForm component)

---

## Increment 5A: Recipe Servings (Foundation)

**What it delivers (user-visible)**:
- Add/Edit Recipe form has a "Servings" field (required, e.g. "serves 4")
- Recipe cards show servings count
- Existing recipes require servings to be added before they can be used in meal planning

**What it builds (technical)**:
- Recipe schema: add `servings: number` field
- Update `validateRecipe` to require servings > 0
- Update RecipeForm with servings input
- Update RecipeList cards to display servings
- Migration: just change the existing JSON files to add servings field

**Acceptance criteria**:
- User creates a new recipe — servings field is required
- User edits an existing recipe — must add servings before saving
- Recipe cards show "Serves 4" (or similar)
- Validation error if servings is missing or zero
- All existing tests updated and passing

---

## Increment 5B: Weekly Meal Plan

**What it delivers (user-visible)**:
- "Plan This Week" button on Recipe Library
- Weekly Plan grid: 7 days × 2 meals (Lunch + Dinner) = 14 slots
- Week starts on a configurable day (default: Monday)
- Tap empty slot → Recipe Selector (list of recipes with servings shown)
- Leftover auto-placement: a 4-serving recipe with family size 2 fills 2 consecutive slots (e.g. Thu Dinner + Fri Lunch), marked as "leftover"
- Family size configurable (default: 2 portions/meal)
- Clear gap visibility: unfilled slots are visually distinct
- Plan persists across page reloads (one active plan at a time)

**What it builds (technical)**:
- Shared types: `MealType`, `MealSlot`, `WeeklyPlan`, `PlanSettings`
- Domain logic: `calculateMealSlots(recipe, startSlot, familySize)` — pure function in `shared/`
- Port: `PlanReader` + `PlanWriter` interfaces
- Adapter: `HttpPlanReader` + `HttpPlanWriter` (calls API)
- Server: `FilePlanRepository` — stores plan at `data/plans/current.json`, settings at `data/plans/settings.json`
- Server routes: `/api/plan`, `/api/plan/settings`
- UI components: `WeeklyPlanGrid`, `MealSlotCard`, `RecipeSelector`, `PlanSettings`
- Routing: `/plan` for the weekly plan view

**Acceptance criteria**:
- User taps "Plan This Week" → sees 14 empty meal slots grouped by day
- User taps empty Thursday Dinner slot → sees recipe selector with servings shown
- User selects "Carbonara (serves 4)" with family size 2 → fills Thursday Dinner + Friday Lunch
- Friday Lunch shows "Carbonara (leftover)"
- User can remove a recipe from a slot (also removes its leftover slots)
- Empty slots are visually obvious (gap detection at a glance)
- User refreshes → plan persists
- User can change week start day and family size in settings
- Integration tests and E2E tests pass

**Design guidance (mobile-first)**:
- Single column, grouped by day (day header → lunch slot → dinner slot)
- Empty slot: dashed border, "+ Add Recipe" text
- Filled slot: recipe name, "leftover" badge if applicable
- Settings accessible via gear icon in plan header

---

## Increment 5C: Shopping Summary

**What it delivers (user-visible)**:
- "View Shopping List" button on Weekly Plan
- Shopping Summary screen: ingredients grouped by recipe (not aggregated)
- Each recipe section shows which meals it covers (e.g. "Carbonara: Thu Dinner, Fri Lunch")
- Only shows recipes from filled slots (empty slots ignored)

**What it builds (technical)**:
- Domain logic: `generateShoppingList(plan, recipes)` — groups ingredients by recipe
- UI component: `ShoppingSummary` with recipe sections
- Routing: `/plan/shopping`

**Acceptance criteria**:
- User with 3 recipes planned taps "View Shopping List"
- Sees ingredients grouped by recipe, each with day/meal label
- Can navigate back to plan to adjust
- Integration tests pass

---

## Technical Dependencies

### Sequential (hard dependencies):
1. Increment 1 before 2 (need structure before data loading)
2. Increment 2 before 3 (need data loading before CRUD)
3. Increment 3 before 4 (need create before edit)
4. Increment 5A before 5B (need servings before meal planning)
5. Increment 5B before 5C (need plan before shopping list)

### Parallel opportunities:
- Increment 4 and 5A can be built in parallel after Increment 3

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Meal slots per day | Lunch + Dinner (2) | Breakfast deferred — design allows adding it later |
| Week start day | Configurable (default Monday) | Families plan differently |
| Family size | Configurable (default 2 portions/meal) | Varies by family; drives leftover logic |
| Leftover placement | Auto-consecutive | Thu Dinner → Fri Lunch is natural; user can remove/replace |
| Existing recipes | Require adding servings | Leftover logic needs accurate numbers |
| Plan persistence | One current plan | Simpler MVP; multi-plan support deferred |
| Shopping list format | Per-recipe breakdown | User wants to see what's needed for each dish |

## Out of Scope (Explicitly Deferred)

- Breakfast meal slot
- Ingredient aggregation across recipes
- Plan templates / plan history
- Drag-and-drop slot rearrangement
- Copy-to-clipboard (add when Tesco integration is ready)
- Search recipes
- Recipe tags or categories
- Cooking instructions

---

## Agent Contributions

| Agent | Contribution |
|-------|-------------|
| Product Owner | Increment breakdown (5A/5B/5C), acceptance criteria, scope decisions |
| Architect | Data model, leftover calculation as pure domain logic, persistence strategy |
| Designer | Mobile-first grid layout, gap visibility, leftover badge, settings UX |
| Software Engineer | Vertical slice approach, integration-first test strategy |
| User Persona | Leftover logic validation, per-recipe shopping grouping, quick-scan requirements |
| Mob Facilitator | Cross-agent alignment, open question resolution |
