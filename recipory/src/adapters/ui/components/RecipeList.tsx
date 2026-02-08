import { Link } from 'react-router';
import type { Recipe } from '../../../domain/recipe.js';

type RecipeListProps = {
  recipes: Recipe[];
};

export function RecipeList({ recipes }: RecipeListProps) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="empty-state">
        <p>No recipes yet</p>
        <p>Add your first recipe to get started</p>
        <Link to="/recipes/new" className="btn-primary">
          Add Recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <div className="recipe-list-header">
        <h2>Recipe Library</h2>
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
