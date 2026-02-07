import type { Recipe } from '../recipe.js';

export interface RecipeRepository {
  save(recipe: Recipe): Promise<Recipe>;
  findById(id: string): Promise<Recipe | null>;
  findAll(): Promise<Recipe[]>;
  search(query: string): Promise<Recipe[]>;
  delete(id: string): Promise<void>;
}
