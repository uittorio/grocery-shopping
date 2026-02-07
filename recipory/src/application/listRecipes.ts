/**
 * List Recipes Use Case
 *
 * Architectural note: Application layer orchestrates domain logic and coordinates
 * with adapters through ports. This use case retrieves all recipes via the repository port.
 */

import type { Recipe } from '../domain/recipe.js';
import type { RecipeRepository } from '../domain/ports/recipeRepository.js';

export type ListRecipes = () => Promise<Recipe[]>;

/**
 * Creates the listRecipes use case
 * @param recipeRepository - Repository implementation
 * @returns Use case function
 */
export function createListRecipes(recipeRepository: RecipeRepository): ListRecipes {
  /**
   * List all recipes
   * @returns Array of recipe entities
   */
  return async function listRecipes(): Promise<Recipe[]> {
    return await recipeRepository.findAll();
  };
}
