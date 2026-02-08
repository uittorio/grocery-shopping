import { http, HttpResponse } from 'msw';
import type { Recipe } from '../../src/domain/recipe.js';

const mockRecipes: Record<string, Recipe> = {
  '550e8400-e29b-41d4-a716-446655440000': {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Spaghetti Carbonara',
    ingredients: [
      { name: 'spaghetti', quantity: 400, unit: 'g' },
      { name: 'eggs', quantity: 4, unit: 'whole' },
      { name: 'parmesan', quantity: 100, unit: 'g' },
    ],
    createdAt: '2026-02-07T00:00:00.000Z',
    updatedAt: '2026-02-07T00:00:00.000Z',
  },
};

const recipeIndex = Object.keys(mockRecipes);

export const handlers = [
  http.get('/data/recipes/index.json', () => {
    return HttpResponse.json(recipeIndex);
  }),
  http.get('/data/recipes/:id', ({ params }) => {
    const filename = params['id'] as string;
    const id = filename.replace('.json', '');
    const recipe = mockRecipes[id];
    if (!recipe) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(recipe);
  }),
];
