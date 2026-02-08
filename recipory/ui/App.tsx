import { Routes, Route, Link } from 'react-router';
import { RecipeLibrary } from './recipes/RecipeLibrary.js';
import { EditRecipe } from './recipes/EditRecipe.js';
import { RecipeForm } from './recipes/RecipeForm.js';
import './App.css';

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
