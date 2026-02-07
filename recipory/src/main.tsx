/**
 * Main Entry Point
 *
 * Architectural note: This is where we wire everything together.
 * - Create adapters (in-memory repository for walking skeleton)
 * - Create use cases (inject dependencies)
 * - Render UI with injected use cases
 *
 * In Increment 2, we'll swap InMemoryRecipeRepository for JsonRecipeRepository here.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import type { Recipe } from './domain/recipe.js';
import { App } from './adapters/ui/App.js';
import { InMemoryRecipeRepository } from './adapters/storage/inMemoryRecipeRepository.js';
import { createListRecipes } from './application/listRecipes.js';

// Initialize storage adapter with hardcoded data for walking skeleton
const hardcodedRecipe: Recipe = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Spaghetti Carbonara',
  ingredients: [
    { name: 'spaghetti', quantity: 400, unit: 'g' },
    { name: 'eggs', quantity: 4, unit: 'whole' },
    { name: 'parmesan', quantity: 100, unit: 'g' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const recipeRepository = new InMemoryRecipeRepository([hardcodedRecipe]);

// Create use cases (dependency injection)
const listRecipes = createListRecipes(recipeRepository);

// Render app
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App listRecipes={listRecipes} />
  </React.StrictMode>
);
