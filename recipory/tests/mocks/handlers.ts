import { http, HttpResponse } from 'msw';
import type { Recipe } from '../../shared/recipe.js';

const mockRecipes: Recipe[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Spaghetti Carbonara',
    servings: 4,
    ingredients: [
      { name: 'spaghetti', quantity: 400, unit: 'g' },
      { name: 'eggs', quantity: 4, unit: 'whole' },
      { name: 'parmesan', quantity: 100, unit: 'g' },
    ],
    createdAt: '2026-02-07T00:00:00.000Z',
    updatedAt: '2026-02-07T00:00:00.000Z',
  },
];

let recipes = [...mockRecipes];

export function resetMockRecipes() {
  recipes = [...mockRecipes];
}

export const handlers = [
  http.get('/api/recipes', () => {
    return HttpResponse.json(recipes);
  }),
  http.get('/api/recipes/:id', ({ params }) => {
    const id = params['id'] as string;
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(recipe);
  }),
  http.post('/api/recipes', async ({ request }) => {
    const recipe = (await request.json()) as Recipe;
    recipes.push(recipe);
    return HttpResponse.json(recipe, { status: 201 });
  }),
  http.put('/api/recipes/:id', async ({ params, request }) => {
    const id = params['id'] as string;
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const updated = (await request.json()) as Recipe;
    recipes[index] = updated;
    return HttpResponse.json(updated);
  }),
  http.delete('/api/recipes/:id', ({ params }) => {
    const id = params['id'] as string;
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    recipes.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
