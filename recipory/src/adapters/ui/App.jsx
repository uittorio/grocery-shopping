/**
 * App Component - Main application shell
 *
 * Architectural note: Entry point for the UI adapter.
 * Wires together use cases and components.
 * State management and dependency injection happen here.
 */

import { useState, useEffect } from 'react';
import { RecipeList } from './components/RecipeList';
import './App.css';

export function App({ listRecipes }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recipes on mount
    async function loadRecipes() {
      try {
        const data = await listRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Failed to load recipes:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, [listRecipes]);

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>Recipory</h1>
      </header>
      <main>
        <RecipeList recipes={recipes} />
      </main>
    </div>
  );
}
