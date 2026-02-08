import { Routes, Route, Link, useParams } from 'react-router';
import { useRecipes } from './hooks/useRecipes.js';
import { useRecipe } from './hooks/useRecipe.js';
import { RecipeList } from './components/RecipeList.js';
import { RecipeForm } from './components/RecipeForm.js';
import './App.css';

function RecipeLibrary() {
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

function EditRecipe() {
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

export function App() {
  return (
    <div className="app">
      <header>
        <Link to="/" className="header-link">
          <h1>Recipory</h1>
        </Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<RecipeLibrary />} />
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        </Routes>
      </main>
    </div>
  );
}
