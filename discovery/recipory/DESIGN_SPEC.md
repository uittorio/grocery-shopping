# Recipory Design Specification

**Version**: 1.0
**Date**: 2026-02-02
**Scope**: MVP feature set (screens, flows, interactions, information hierarchy)

---

## Table of Contents

1. [Screen Inventory](#screen-inventory)
2. [User Flows](#user-flows)
3. [Key Interaction Decisions](#key-interaction-decisions)
4. [Information Hierarchy](#information-hierarchy)
5. [Design Principles](#design-principles)

---

## Screen Inventory

### 1. Recipe Library (Home Screen)

**Purpose**: Central hub where users browse their personal recipe collection, search for recipes, and navigate to other parts of the app.

**Key Elements**:
- **Header**: App title (Recipory), primary navigation
- **Search bar**: Search recipes by name (text input, real-time filtering)
- **Recipe list**: Grid or vertical list of all saved recipes. Each recipe card shows:
  - Recipe name (primary)
  - Ingredient count (secondary, e.g., "6 ingredients")
  - Tap target: Entire card is tappable (min 48px height on mobile)
- **"Add Recipe" button**: Prominent, persistent action. Floating action button (FAB) on mobile or button in header/footer on desktop.
- **"Plan Shopping" button**: Secondary action to start weekly recipe selection.
- **Empty state**: If no recipes exist, show a centered card with "No recipes yet" and encourage user to add one.

**Responsive behavior**:
- Mobile (< 600px): Single-column list, full-width recipe cards
- Tablet/Desktop (>= 600px): 2-3 column grid

**Accessibility**:
- Search input has clear label
- Recipe cards are semantic links or buttons with clear focus states
- Recipe count is announced to screen readers

---

### 2. Recipe Detail / Edit Screen

**Purpose**: View, create, and edit a single recipe. Users add/remove ingredients and save changes.

**Key Elements**:
- **Header**: Back button (mobile) or breadcrumb navigation (desktop), screen title ("New Recipe" or recipe name)
- **Recipe name field**: Text input, required field. Placeholder text: "e.g., Spaghetti Bolognese"
- **Ingredients section**:
  - Heading: "Ingredients"
  - Ingredient list: Each ingredient is a row with:
    - **Quantity + unit** (e.g., "500g") -- optional but recommended
    - **Ingredient name** (e.g., "flour") -- required
  - Each ingredient row has a **remove button** (trash icon or text link, min 44px touch target)
  - **"Add ingredient" button** below the list (adds a new empty ingredient row)
- **Action buttons** (at bottom or sticky footer):
  - **Save**: Primary button
  - **Cancel**: Secondary button (returns without saving)
  - **Delete** (edit mode only): Tertiary/destructive button, requires confirmation

**Interaction details**:
- Ingredient inputs are forgiving (free text, no rigid format)
- Auto-focus new ingredient name field when "Add ingredient" is clicked
- Removing an ingredient is immediate
- Saving returns user to Recipe Library

**Validation**:
- Recipe name is required
- At least one ingredient is required
- Show inline error messages if user tries to save with missing required fields

**Empty state** (new recipe):
- No ingredients yet -- just show the "Add ingredient" button
- Confirm user intention when canceling unsaved changes

**Responsive behavior**:
- Mobile: Single-column, full-width inputs, sticky action buttons at bottom
- Desktop: Similar layout, action buttons may be inline or sticky

**Accessibility**:
- Form labels are associated with inputs
- Required fields are marked clearly (visually + aria-required)
- Error messages are linked to their fields with aria-describedby
- Ingredient rows can be navigated with keyboard (tab, shift+tab)

---

### 3. Weekly Shopping Flow

**Purpose**: Select recipes for the week, review the combined ingredient list, and generate a shopping list.

**Sub-screens**:
- **3a. Recipe Selection**: Choose which recipes to cook this week
- **3b. Shopping List**: See combined ingredients and copy to clipboard

---

#### 3a. Recipe Selection

**Purpose**: Check off the recipes the user wants to cook this week.

**Key Elements**:
- **Header**: "Plan Shopping" or "Select Recipes"
- **Recipe checklist**: List of all saved recipes, each with:
  - **Checkbox** (left side, min 44px touch target)
  - **Recipe name** (main label, tappable to toggle checkbox)
  - **Ingredient count** (secondary info, e.g., "6 ingredients")
- **Summary card** (sticky or floating):
  - "X recipes selected"
  - Ingredient count across selected recipes (e.g., "18 ingredients total")
- **"Generate Shopping List" button** (primary): Sticky footer. Disabled if no recipes are selected.
- **Cancel/Back**: Navigation back to Recipe Library

**Interaction details**:
- Clicking recipe name or checkbox toggles selection
- Summary updates in real-time as user checks/unchecks

**Responsive behavior**:
- Mobile: Full-width list, sticky summary and button
- Desktop: Similar, or could be 2-column layout with summary in sidebar

**Accessibility**:
- Checkboxes have accessible labels
- Summary card is a live region (aria-live="polite") so updates are announced
- Keyboard navigation fully supported (tab, space to toggle)

---

#### 3b. Shopping List

**Purpose**: Show the combined ingredient list from all selected recipes. User can remove items they already have, then copy the list.

**Key Elements**:
- **Header**: "Shopping List"
- **Recipe summary**: Collapsible section showing which recipes are selected
- **Ingredient list**: All ingredients from selected recipes, listed as:
  - **Ingredient name** (e.g., "Chicken breast")
  - **Quantity + unit** (e.g., "1.5 kg")
  - **Recipe source** (optional secondary info: which recipe needs this item)
  - **Remove button** (trash icon, min 44px touch target)
- **Action buttons** (sticky bottom/footer):
  - **Copy to Clipboard**: Primary button. Copies the shopping list as plain text.
  - **Back**: Return to Recipe Selection

**Interaction details**:
- Removing an ingredient is immediate (removes from this shopping session only, doesn't modify recipes)
- "Copy to Clipboard" generates a clean text list (ingredient name + quantity, one per line)
- Show brief confirmation when copied (e.g., toast "Copied!")

**Note on aggregation**:
- **MVP approach**: Do NOT aggregate quantities (e.g., if two recipes need 1 onion each, show "1 onion" twice). Keeps it simple.
- Future: Aggregate with a toggle ("Combine like ingredients" option)

**Responsive behavior**:
- Mobile: Full-width list, compact ingredient rows, sticky buttons
- Desktop: 2-column or wider layout, more generous spacing

**Accessibility**:
- Ingredients are semantic list items
- Remove buttons have clear labels ("Remove [ingredient name]")
- Copy confirmation is announced via aria-live

---

## User Flows

### Flow 1: Add a Recipe (First-Time Setup)

```
Home (Recipe Library, empty)
  | Tap "Add Recipe"
Recipe Detail Screen (new)
  | User enters recipe name and adds ingredients
  | Tap "Save"
Home (Recipe Library, 1 recipe visible)
  | (Repeat for more recipes)
```

**Key moments**:
- Empty state is encouraging ("Start by adding your favourite recipes")
- Ingredient input is fast (free text, no validation friction)
- Save is immediate and clear
- User sees their recipe immediately after save

---

### Flow 2: Plan Weekly Shopping (Core Value)

```
Home (Recipe Library, with recipes)
  | Tap "Plan Shopping"
Screen 3a (Recipe Selection)
  | User checks off recipes for the week
  | Summary updates in real-time
  | Tap "Generate Shopping List"
Screen 3b (Shopping List)
  | User reviews combined ingredient list
  | Optionally removes items they already have
  | Tap "Copy to Clipboard"
  | Done -- user takes the list to the shop
```

**Key moments**:
- Fast navigation (3 taps to a shopping list)
- Real-time feedback at each step
- User always has a clear next action
- Copy to clipboard works everywhere

---

### Flow 3: Edit an Existing Recipe

```
Home (Recipe Library)
  | Tap a recipe card
Screen 2 (Recipe Detail, edit mode)
  | User sees recipe name and all ingredients
  | Can add new ingredients, remove existing, or change quantities
  | Tap "Save"
Home (Recipe Library)
  | Recipe is updated
```

**Key moments**:
- Recipe detail screen is the same for create and edit (consistency)
- Changes are only saved when user taps Save (no auto-save)

---

### Flow 4: Remove Items Before Copying

```
(Within Flow 2, at Screen 3b)
Screen 3b (Shopping List)
  | User sees ingredient list
  | Realises they already have flour at home
  | Taps trash icon next to "flour"
  | Flour is removed from the list
  | Tap "Copy to Clipboard"
```

**Key moments**:
- Adjusting ingredients is immediate and doesn't affect saved recipes
- User has full control over what ends up on the list

---

## Key Interaction Decisions

### 1. Ingredient Format: Free Text, Not Structured

**Decision**: Ingredients are entered as free text (e.g., "2 chicken breasts" or "500g flour"). No rigid form with separate quantity/unit/name fields.

**Rationale**:
- Users naturally think in phrases, not structured data
- Lower barrier to entry (faster to type one field than three)
- Free text is more forgiving for edge cases ("a pinch of salt", "to taste")

**Trade-off**: Harder to aggregate quantities across recipes. Acceptable for MVP.

---

### 2. Recipe Selection: Checkbox-Based Multi-Select

**Decision**: Recipe selection is a checklist (checkboxes) rather than a modal dialog or inline toggle.

**Rationale**:
- Checkboxes are explicit and clear (especially important for accessibility)
- Allows users to see all recipes and selections at once
- Summary card provides real-time feedback

---

### 3. Ingredient Removal: Immediate, Not Undo

**Decision**: Removing an ingredient from the shopping list is immediate. User can go back to recipe selection to restore.

**Rationale**:
- Keeps the UI simple
- Low stakes (user can easily re-do by going back)

---

### 4. No Ingredient Aggregation in MVP

**Decision**: If the same ingredient appears in multiple recipes, it's shown separately. Example: two recipes need "1 onion" each, so the list shows "1 onion" twice.

**Rationale**:
- Keeps the feature simple and shippable
- No complex logic to determine when ingredients are "the same"
- Users can mentally combine while shopping

**Future**: v1.1 can add "Combine like ingredients" toggle.

---

### 5. Persistent State: Recipes Persist, Selections Don't

**Decision**:
- Recipes are saved to storage (survive app reload)
- Weekly shopping selections are transient (cleared when user leaves the flow)

**Rationale**:
- Recipes are a permanent library; selections are transient
- Users plan shopping each week fresh
- Keeps the code simple

---

### 6. Shopping List Output: Copy to Clipboard

**Decision**: The shopping list is exported via "Copy to Clipboard" as plain text.

**Rationale**:
- Works on every device and platform
- User can paste into any app (Notes, WhatsApp, etc.)
- No integration complexity

**Future**: Could add share via system share sheet, email, or print.

---

## Information Hierarchy

### Recipe Library Screen

**Primary**: Recipe list (large, scannable cards) and "Add Recipe" button
**Secondary**: Ingredient count per recipe, search field
**Tertiary**: Empty state message, "Plan Shopping" entry point

---

### Recipe Detail Screen

**Primary**: Recipe name field and ingredient list
**Secondary**: Ingredient quantity, remove buttons
**Tertiary**: Cancel/Back, Delete button (edit mode)

---

### Recipe Selection Screen (3a)

**Primary**: Recipe checklist
**Secondary**: Selection summary (count of recipes and ingredients)
**Call-to-Action**: "Generate Shopping List" button

---

### Shopping List Screen (3b)

**Primary**: Ingredient list
**Secondary**: Recipe sources per ingredient
**Call-to-Action**: "Copy to Clipboard" button

---

## Design Principles

### 1. Speed Over Polish

This is a utility tool for a busy family. A user should go from opening the app to having a shopping list in under a minute.

### 2. Forgiving Inputs

Ingredient entry is free text, not a rigid form. Search is tolerant of variations. Embrace messy real-world data.

### 3. Mobile-First, But Not Mobile-Only

Busy parents often plan meals on their phones. The app must work beautifully on mobile but also on desktop for bulk recipe entry.

### 4. Minimal Navigation Depth

Max 3 screens deep to accomplish any task. Reduce cognitive load.

### 5. Clear Visual Feedback

Every action has feedback (button presses, state changes, success confirmations). Users should never wonder if their tap registered.

### 6. Accessibility as Standard

Keyboard navigation, screen reader support, high contrast, and clear labels are table stakes.

---

## Appendix: Screen Map

```
Home (Recipe Library)
+-- [Add Recipe] --> Screen 2 (Create)
+-- [Recipe card] --> Screen 2 (Edit)
+-- [Plan Shopping] --> Screen 3a (Recipe Selection)

Screen 2 (Recipe Detail)
+-- [Save] --> Home
+-- [Cancel] --> Home
+-- [Delete] --> Confirmation --> Home

Screen 3a (Recipe Selection)
+-- [Back] --> Home
+-- [Generate Shopping List] --> Screen 3b

Screen 3b (Shopping List)
+-- [Back] --> Screen 3a
+-- [Copy to Clipboard] --> Confirmation toast
```
