import type { Recipe } from '../recipe.js';

export interface RecipeWriter {
  create(recipe: Recipe): Promise<Recipe>;
}
