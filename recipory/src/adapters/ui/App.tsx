import { useRecipes } from './hooks/useRecipes.js';
import { RecipeList } from './components/RecipeList.js';
import './App.css';

export function App() {
  const { data: recipes, isLoading, error } = useRecipes();

  if (isLoading) {
    return <div>Loading recipes...</div>;
  }

  if (error) {
    return <div>Failed to load recipes</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>Recipory</h1>
      </header>
      <main>
        <RecipeList recipes={recipes ?? []} />
      </main>
    </div>
  );
}
