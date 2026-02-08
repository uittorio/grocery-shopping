import type { Recipe } from '../../domain/recipe.js';
import type { RecipeWriter } from '../../domain/ports/recipeWriter.js';

export class HttpRecipeWriter implements RecipeWriter {
  async create(recipe: Recipe): Promise<Recipe> {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      throw new Error('Failed to create recipe');
    }
    return await response.json();
  }
}
