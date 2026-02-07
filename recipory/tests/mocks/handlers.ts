import { http, HttpResponse } from 'msw';
import type { Recipe } from '../../src/domain/recipe.js';

const mockRecipes: Recipe[] = [
  {
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
];

export const handlers = [
  http.get('/data/recipes.json', () => {
    return HttpResponse.json(mockRecipes);
  }),
];
