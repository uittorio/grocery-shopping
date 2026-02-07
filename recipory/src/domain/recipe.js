/**
 * Recipe entity - core domain object
 *
 * Architectural note: This is pure business logic with no I/O dependencies.
 * Validation happens here at the domain boundary.
 */

/**
 * Creates a Recipe entity
 * @param {Object} data - Recipe data
 * @param {string} data.id - Unique identifier (UUID)
 * @param {string} data.name - Recipe name
 * @param {Array<Object>} data.ingredients - List of ingredients
 * @param {string} data.createdAt - ISO 8601 timestamp
 * @param {string} data.updatedAt - ISO 8601 timestamp
 * @returns {Object} Recipe entity
 * @throws {Error} if validation fails
 */
export function createRecipe({ id, name, ingredients, createdAt, updatedAt }) {
  // Validation rules from domain requirements
  if (!name || name.trim() === '') {
    throw new Error('Recipe name is required');
  }

  if (!ingredients || ingredients.length === 0) {
    throw new Error('At least one ingredient is required');
  }

  // Validate ingredient structure
  ingredients.forEach((ingredient, index) => {
    if (!ingredient.name || ingredient.name.trim() === '') {
      throw new Error(`Ingredient at position ${index} must have a name`);
    }
  });

  return {
    id,
    name: name.trim(),
    ingredients: ingredients.map(ing => ({
      name: ing.name.trim(),
      quantity: ing.quantity || null,
      unit: ing.unit || null,
    })),
    createdAt,
    updatedAt,
  };
}

/**
 * Generates a new UUID for recipes
 * Note: Simple implementation for POC. In production, consider crypto.randomUUID()
 */
export function generateRecipeId() {
  return crypto.randomUUID();
}
