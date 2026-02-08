import type { Recipe } from '../../domain/recipe.js';
import type { RecipeReader } from '../../domain/ports/recipeReader.js';

export class HttpRecipeReader implements RecipeReader {
  async findAll(): Promise<Recipe[]> {
    const indexResponse = await fetch('/data/recipes/index.json');
    if (!indexResponse.ok) {
      throw new Error('Failed to fetch recipe index');
    }
    const ids: string[] = await indexResponse.json();
    const recipes = await Promise.all(ids.map(id => this.fetchRecipe(id)));
    return recipes.filter((r): r is Recipe => r !== null);
  }

  async findById(id: string): Promise<Recipe | null> {
    return this.fetchRecipe(id);
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

  private async fetchRecipe(id: string): Promise<Recipe | null> {
    const response = await fetch(`/data/recipes/${id}.json`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  }
}
