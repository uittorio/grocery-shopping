import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  validateRecipe,
  hasValidationErrors,
  generateRecipeId,
} from '../../../domain/recipe.js';
import type { Recipe, RecipeValidationErrors } from '../../../domain/recipe.js';
import { useCreateRecipe } from '../hooks/useCreateRecipe.js';
import { useUpdateRecipe } from '../hooks/useUpdateRecipe.js';
import { useDeleteRecipe } from '../hooks/useDeleteRecipe.js';

interface IngredientFormRow {
  name: string;
  quantity: string;
  unit: string;
}

function createEmptyIngredient(): IngredientFormRow {
  return { name: '', quantity: '', unit: '' };
}

function toFormRows(recipe: Recipe): IngredientFormRow[] {
  return recipe.ingredients.map(ing => ({
    name: ing.name,
    quantity: ing.quantity !== null ? String(ing.quantity) : '',
    unit: ing.unit ?? '',
  }));
}

type RecipeFormProps = {
  initialRecipe?: Recipe;
};

export function RecipeForm({ initialRecipe }: RecipeFormProps) {
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();
  const isEditMode = !!initialRecipe;

  const [name, setName] = useState(initialRecipe?.name ?? '');
  const [ingredients, setIngredients] = useState<IngredientFormRow[]>(
    initialRecipe ? toFormRows(initialRecipe) : [createEmptyIngredient()]
  );
  const [errors, setErrors] = useState<RecipeValidationErrors>({});

  function handleAddIngredient() {
    setIngredients([...ingredients, createEmptyIngredient()]);
  }

  function handleRemoveIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function handleIngredientChange(
    index: number,
    field: keyof IngredientFormRow,
    value: string
  ) {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    setIngredients(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedIngredients = ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity ? Number(ing.quantity) : null,
      unit: ing.unit || null,
    }));

    const validationErrors = validateRecipe({
      name,
      ingredients: parsedIngredients,
    });

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    const now = new Date().toISOString();

    if (isEditMode) {
      const recipe: Recipe = {
        id: initialRecipe.id,
        name: name.trim(),
        ingredients: parsedIngredients,
        createdAt: initialRecipe.createdAt,
        updatedAt: now,
      };
      updateRecipe.mutate(recipe, {
        onSuccess: () => navigate('/'),
      });
    } else {
      const recipe: Recipe = {
        id: generateRecipeId(),
        name: name.trim(),
        ingredients: parsedIngredients,
        createdAt: now,
        updatedAt: now,
      };
      createRecipe.mutate(recipe, {
        onSuccess: () => navigate('/'),
      });
    }
  }

  function handleCancel() {
    navigate('/');
  }

  function handleDelete() {
    if (!initialRecipe) return;
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe.mutate(initialRecipe.id, {
        onSuccess: () => navigate('/'),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2>{isEditMode ? 'Edit Recipe' : 'New Recipe'}</h2>

      <div className="form-field">
        <label htmlFor="recipe-name">Recipe Name</label>
        <input
          id="recipe-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., Spaghetti Bolognese"
          className={errors.name ? 'input-error' : ''}
          aria-required="true"
          aria-describedby={errors.name ? 'recipe-name-error' : undefined}
        />
        {errors.name && (
          <span id="recipe-name-error" className="error-message">
            {errors.name}
          </span>
        )}
      </div>

      <fieldset className="ingredients-section">
        <legend>Ingredients</legend>
        {errors.ingredients && (
          <span className="error-message">{errors.ingredients}</span>
        )}
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-row">
            <div className="form-field">
              <label htmlFor={`ingredient-name-${index}`}>Name</label>
              <input
                id={`ingredient-name-${index}`}
                type="text"
                value={ingredient.name}
                onChange={e =>
                  handleIngredientChange(index, 'name', e.target.value)
                }
                placeholder="e.g., flour"
                className={errors.ingredientNames?.[index] ? 'input-error' : ''}
                aria-required="true"
                aria-describedby={
                  errors.ingredientNames?.[index]
                    ? `ingredient-name-error-${index}`
                    : undefined
                }
              />
              {errors.ingredientNames?.[index] && (
                <span
                  id={`ingredient-name-error-${index}`}
                  className="error-message"
                >
                  {errors.ingredientNames[index]}
                </span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor={`ingredient-quantity-${index}`}>Quantity</label>
              <input
                id={`ingredient-quantity-${index}`}
                type="number"
                value={ingredient.quantity}
                onChange={e =>
                  handleIngredientChange(index, 'quantity', e.target.value)
                }
                placeholder="e.g., 500"
              />
            </div>
            <div className="form-field">
              <label htmlFor={`ingredient-unit-${index}`}>Unit</label>
              <input
                id={`ingredient-unit-${index}`}
                type="text"
                value={ingredient.unit}
                onChange={e =>
                  handleIngredientChange(index, 'unit', e.target.value)
                }
                placeholder="e.g., g"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveIngredient(index)}
              className="remove-ingredient"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="add-ingredient"
        >
          Add Ingredient
        </button>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button type="button" onClick={handleCancel} className="btn-secondary">
          Cancel
        </button>
        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
