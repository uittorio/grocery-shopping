import type { Recipe } from '../../../shared/recipe.js';
import type { RecipeReader } from '../recipes/ports/recipeReader.js';

export class HttpRecipeReader implements RecipeReader {
  async findAll(): Promise<Recipe[]> {
    const response = await fetch('/api/recipes');
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  }

  async findById(id: string): Promise<Recipe | null> {
    const response = await fetch(`/api/recipes/${id}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  }

  async search(query: string): Promise<Recipe[]> {
    const recipes = await this.findAll();
    const lowerQuery = query.toLowerCase();
    return recipes.filter(recipe => {
      if (recipe.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      return recipe.ingredients.some(ing =>
        ing.name.toLowerCase().includes(lowerQuery)
      );
    });
  }
}
