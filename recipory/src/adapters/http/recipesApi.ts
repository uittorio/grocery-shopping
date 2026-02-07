import type { Recipe } from '../../domain/recipe.js';

export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await fetch('/data/recipes.json');
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return await response.json();
}
