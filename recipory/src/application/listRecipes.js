/**
 * List Recipes Use Case
 *
 * Architectural note: Application layer orchestrates domain logic and coordinates
 * with adapters through ports. This use case retrieves all recipes via the repository port.
 */

/**
 * Creates the listRecipes use case
 * @param {RecipeRepository} recipeRepository - Repository implementation
 * @returns {Function} Use case function
 */
export function createListRecipes(recipeRepository) {
  /**
   * List all recipes
   * @returns {Promise<Array<Object>>} Array of recipe entities
   */
  return async function listRecipes() {
    return await recipeRepository.findAll();
  };
}
