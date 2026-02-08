import type { Recipe } from '../../../../shared/recipe.js';

export interface RecipeWriter {
  create(recipe: Recipe): Promise<Recipe>;
  update(recipe: Recipe): Promise<Recipe>;
  delete(id: string): Promise<void>;
}
