import type { Recipe } from '../../../shared/recipe.js';

export interface RecipeReader {
  findAll(): Promise<Recipe[]>;
  findById(id: string): Promise<Recipe | null>;
  search(query: string): Promise<Recipe[]>;
}
