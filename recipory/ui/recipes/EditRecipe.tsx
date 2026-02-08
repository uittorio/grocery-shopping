import { Link, useParams } from 'react-router';
import { useRecipe } from './useRecipe.js';
import { RecipeForm } from './RecipeForm.js';

export function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error } = useRecipe(id!);

  if (isLoading) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        Loading recipe...
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="error-state" role="alert">
        <p>Recipe not found</p>
        <Link to="/" className="btn-primary">
          Back to Library
        </Link>
      </div>
    );
  }

  return <RecipeForm initialRecipe={recipe} />;
}
