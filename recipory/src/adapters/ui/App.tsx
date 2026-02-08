import { Routes, Route, useParams } from 'react-router';
import { useRecipes } from './hooks/useRecipes.js';
import { useRecipe } from './hooks/useRecipe.js';
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

function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error } = useRecipe(id!);

  if (isLoading) {
    return <div>Loading recipe...</div>;
  }

  if (error || !recipe) {
    return <div>Recipe not found</div>;
  }

  return <RecipeForm initialRecipe={recipe} />;
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
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        </Routes>
      </main>
    </div>
  );
}
