import type { Recipe } from '../recipe.js';

export interface RecipeWriter {
  save(recipe: Recipe): Promise<Recipe>;
  delete(id: string): Promise<void>;
}
