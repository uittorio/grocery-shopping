/**
 * RecipeList Component
 *
 * Architectural note: UI adapter that consumes application use cases.
 * For walking skeleton, displays hardcoded recipe data.
 * Will be enhanced in Increment 3 with full CRUD interactions.
 */

export function RecipeList({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="empty-state">
        <p>No recipes yet</p>
        <p>Add your first recipe to get started</p>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <h2>Recipe Library</h2>
      {recipes.map(recipe => (
        <div key={recipe.id} className="recipe-card">
          <h3>{recipe.name}</h3>
          <p className="ingredient-count">
            {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
          </p>
        </div>
      ))}
    </div>
  );
}
