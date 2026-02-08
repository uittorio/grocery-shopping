export interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeValidationErrors {
  name?: string;
  ingredients?: string;
  ingredientNames?: Record<number, string>;
}

export function validateRecipe(input: {
  name: string;
  ingredients: { name: string; quantity: number | null; unit: string | null }[];
}): RecipeValidationErrors {
  const errors: RecipeValidationErrors = {};

  if (!input.name.trim()) {
    errors.name = 'Recipe name is required';
  }

  if (input.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required';
  }

  const ingredientNameErrors: Record<number, string> = {};
  input.ingredients.forEach((ingredient, index) => {
    if (!ingredient.name.trim()) {
      ingredientNameErrors[index] = 'Ingredient name is required';
    }
  });

  if (Object.keys(ingredientNameErrors).length > 0) {
    errors.ingredientNames = ingredientNameErrors;
  }

  return errors;
}

export function hasValidationErrors(errors: RecipeValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function generateRecipeId(): string {
  return crypto.randomUUID();
}
