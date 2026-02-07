import type { Recipe } from '../../domain/recipe.js';
import type { RecipeReader } from '../../domain/ports/recipeReader.js';

export class HttpRecipeReader implements RecipeReader {
  async findAll(): Promise<Recipe[]> {
    const response = await fetch('/data/recipes.json');
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  }

  async findById(id: string): Promise<Recipe | null> {
    const recipes = await this.findAll();
    return recipes.find(recipe => recipe.id === id) ?? null;
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
