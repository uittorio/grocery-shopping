import { Link } from 'react-router';
import type { Recipe } from '../../../shared/recipe.js';

type RecipeListProps = {
  recipes: Recipe[];
};

export function RecipeList({ recipes }: RecipeListProps) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="empty-state">
        <p>Your Recipe Library is Empty</p>
        <p>Start building your collection by adding your first recipe.</p>
        <Link to="/recipes/new" className="btn-primary">
          Add Your First Recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <div className="recipe-list-header">
        <h2>Recipe Library</h2>
        <span className="recipe-count" aria-live="polite">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </span>
        <Link to="/recipes/new" className="btn-primary">
          Add Recipe
        </Link>
      </div>
      {recipes.map(recipe => (
        <Link
          key={recipe.id}
          to={`/recipes/${recipe.id}/edit`}
          className="recipe-card"
        >
          <h3>{recipe.name}</h3>
          <p className="ingredient-count">
            {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
          </p>
        </Link>
      ))}
    </div>
  );
}
