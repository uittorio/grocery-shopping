import { Routes, Route } from 'react-router';
import { useRecipes } from './hooks/useRecipes.js';
import { RecipeList } from './components/RecipeList.js';
import { RecipeForm } from './components/RecipeForm.js';
import './App.css';

function RecipeLibrary() {
  const { data: recipes, isLoading, error } = useRecipes();

  if (isLoading) {
    return <div>Loading recipes...</div>;
  }

  if (error) {
    return <div>Failed to load recipes</div>;
  }

  return <RecipeList recipes={recipes ?? []} />;
}

export function App() {
  return (
    <div className="app">
      <header>
        <h1>Recipory</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<RecipeLibrary />} />
          <Route path="/recipes/new" element={<RecipeForm />} />
        </Routes>
      </main>
    </div>
  );
}
