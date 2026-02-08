import type { Recipe } from '../../shared/recipe.js';
import type { RecipeWriter } from '../recipes/ports/recipeWriter.js';

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

  async update(recipe: Recipe): Promise<Recipe> {
    const response = await fetch(`/api/recipes/${recipe.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }
    return await response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
  }
}
