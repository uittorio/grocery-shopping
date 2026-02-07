import type { Recipe } from '../domain/recipe.js';
import type { RecipeRepository } from '../domain/ports/recipeRepository.js';

export type ListRecipes = () => Promise<Recipe[]>;

export function createListRecipes(recipeRepository: RecipeRepository): ListRecipes {
  return async function listRecipes(): Promise<Recipe[]> {
    return await recipeRepository.findAll();
  };
}
