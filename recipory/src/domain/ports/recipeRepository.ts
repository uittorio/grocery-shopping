/**
 * RecipeRepository Port - Interface for recipe persistence
 *
 * Architectural note: This is a port in hexagonal architecture.
 * The domain defines what operations it needs; adapters implement them.
 * This keeps domain logic independent of storage mechanisms (JSON, SQLite, etc).
 *
 * All methods are async to support future I/O operations.
 */

import type { Recipe } from '../recipe.js';

export interface RecipeRepository {
  /**
   * Save a recipe (create or update)
   * @param recipe - Recipe entity
   * @returns Saved recipe
   */
  save(recipe: Recipe): Promise<Recipe>;

  /**
   * Find a recipe by ID
   * @param id - Recipe ID
   * @returns Recipe or null if not found
   */
  findById(id: string): Promise<Recipe | null>;

  /**
   * Find all recipes
   * @returns Array of recipes
   */
  findAll(): Promise<Recipe[]>;

  /**
   * Search recipes by query string
   * @param query - Search term
   * @returns Matching recipes
   */
  search(query: string): Promise<Recipe[]>;

  /**
   * Delete a recipe by ID
   * @param id - Recipe ID
   */
  delete(id: string): Promise<void>;
}
