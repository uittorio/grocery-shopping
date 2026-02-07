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
import { App } from './adapters/ui/App';
import { InMemoryRecipeRepository } from './adapters/storage/inMemoryRecipeRepository';
import { createListRecipes } from './application/listRecipes';

// Initialize storage adapter with hardcoded data for walking skeleton
const hardcodedRecipe = {
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
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App listRecipes={listRecipes} />
  </React.StrictMode>
);
