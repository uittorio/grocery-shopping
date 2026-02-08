import { useRecipes } from './useRecipes.js';
import { RecipeList } from './RecipeList.js';

export function RecipeLibrary() {
  const { data: recipes, isLoading, error, refetch } = useRecipes();

  if (isLoading) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        Loading recipes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state" role="alert">
        <p>Failed to load recipes</p>
        <button className="btn-primary" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return <RecipeList recipes={recipes ?? []} />;
}
