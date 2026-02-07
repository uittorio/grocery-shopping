/**
 * RecipeRepository Port - Interface for recipe persistence
 *
 * Architectural note: This is a port in hexagonal architecture.
 * The domain defines what operations it needs; adapters implement them.
 * This keeps domain logic independent of storage mechanisms (JSON, SQLite, etc).
 *
 * All methods are async to support future I/O operations.
 */

/**
 * @interface RecipeRepository
 */
export class RecipeRepository {
  /**
   * Save a recipe (create or update)
   * @param {Object} recipe - Recipe entity
   * @returns {Promise<Object>} Saved recipe
   */
  async save(recipe) {
    throw new Error('save() must be implemented by adapter');
  }

  /**
   * Find a recipe by ID
   * @param {string} id - Recipe ID
   * @returns {Promise<Object|null>} Recipe or null if not found
   */
  async findById(id) {
    throw new Error('findById() must be implemented by adapter');
  }

  /**
   * Find all recipes
   * @returns {Promise<Array<Object>>} Array of recipes
   */
  async findAll() {
    throw new Error('findAll() must be implemented by adapter');
  }

  /**
   * Search recipes by query string
   * @param {string} query - Search term
   * @returns {Promise<Array<Object>>} Matching recipes
   */
  async search(query) {
    throw new Error('search() must be implemented by adapter');
  }

  /**
   * Delete a recipe by ID
   * @param {string} id - Recipe ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('delete() must be implemented by adapter');
  }
}
