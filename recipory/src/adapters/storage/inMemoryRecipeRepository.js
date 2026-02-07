/**
 * In-Memory Recipe Repository Adapter
 *
 * Architectural note: This adapter implements the RecipeRepository port.
 * Used for walking skeleton and testing. Will be replaced by JSON file adapter in Increment 2.
 */

import { RecipeRepository } from '../../domain/ports/recipeRepository.js';

export class InMemoryRecipeRepository extends RecipeRepository {
  constructor(initialData = []) {
    super();
    // Store recipes in a Map for O(1) lookup by ID
    this.recipes = new Map();
    initialData.forEach(recipe => {
      this.recipes.set(recipe.id, recipe);
    });
  }

  async save(recipe) {
    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  async findById(id) {
    return this.recipes.get(id) || null;
  }

  async findAll() {
    return Array.from(this.recipes.values());
  }

  async search(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe => {
      // Search in recipe name
      if (recipe.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // Search in ingredient names
      return recipe.ingredients.some(ing =>
        ing.name.toLowerCase().includes(lowerQuery)
      );
    });
  }

  async delete(id) {
    this.recipes.delete(id);
  }
}
