import React from 'react';
import ReactDOM from 'react-dom/client';
import type { Recipe } from './domain/recipe.js';
import { App } from './adapters/ui/App.js';
import { InMemoryRecipeRepository } from './adapters/storage/inMemoryRecipeRepository.js';
import { createListRecipes } from './application/listRecipes.js';

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

const listRecipes = createListRecipes(recipeRepository);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App listRecipes={listRecipes} />
  </React.StrictMode>
);
