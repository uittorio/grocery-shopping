import { describe, it, expect } from 'vitest';
import { createRecipe, generateRecipeId } from '../../src/domain/recipe.js';

describe('Recipe Entity', () => {
  describe('createRecipe', () => {
    it('creates a valid recipe with all fields', () => {
      const recipeData = {
        id: '123',
        name: 'Spaghetti Carbonara',
        ingredients: [
          { name: 'spaghetti', quantity: 400, unit: 'g' },
          { name: 'eggs', quantity: 4, unit: 'whole' },
        ],
        createdAt: '2026-02-02T10:00:00Z',
        updatedAt: '2026-02-02T10:00:00Z',
      };

      const recipe = createRecipe(recipeData);

      expect(recipe.id).toBe('123');
      expect(recipe.name).toBe('Spaghetti Carbonara');
      expect(recipe.ingredients).toHaveLength(2);
      expect(recipe.ingredients[0]?.name).toBe('spaghetti');
    });

    it('trims whitespace from recipe name', () => {
      const recipe = createRecipe({
        id: '123',
        name: '  Pasta  ',
        ingredients: [{ name: 'pasta' }],
        createdAt: '2026-02-02T10:00:00Z',
        updatedAt: '2026-02-02T10:00:00Z',
      });

      expect(recipe.name).toBe('Pasta');
    });

    it('throws error if name is empty', () => {
      expect(() =>
        createRecipe({
          id: '123',
          name: '',
          ingredients: [{ name: 'pasta' }],
          createdAt: '2026-02-02T10:00:00Z',
          updatedAt: '2026-02-02T10:00:00Z',
        })
      ).toThrow('Recipe name is required');
    });

    it('throws error if name is only whitespace', () => {
      expect(() =>
        createRecipe({
          id: '123',
          name: '   ',
          ingredients: [{ name: 'pasta' }],
          createdAt: '2026-02-02T10:00:00Z',
          updatedAt: '2026-02-02T10:00:00Z',
        })
      ).toThrow('Recipe name is required');
    });

    it('throws error if ingredients array is empty', () => {
      expect(() =>
        createRecipe({
          id: '123',
          name: 'Pasta',
          ingredients: [],
          createdAt: '2026-02-02T10:00:00Z',
          updatedAt: '2026-02-02T10:00:00Z',
        })
      ).toThrow('At least one ingredient is required');
    });

    it('throws error if ingredient has no name', () => {
      expect(() =>
        createRecipe({
          id: '123',
          name: 'Pasta',
          ingredients: [{ name: '' }],
          createdAt: '2026-02-02T10:00:00Z',
          updatedAt: '2026-02-02T10:00:00Z',
        })
      ).toThrow('Ingredient at position 0 must have a name');
    });

    it('allows ingredients without quantity and unit', () => {
      const recipe = createRecipe({
        id: '123',
        name: 'Simple Recipe',
        ingredients: [{ name: 'salt' }],
        createdAt: '2026-02-02T10:00:00Z',
        updatedAt: '2026-02-02T10:00:00Z',
      });

      expect(recipe.ingredients[0]?.quantity).toBeNull();
      expect(recipe.ingredients[0]?.unit).toBeNull();
    });
  });

  describe('generateRecipeId', () => {
    it('generates a valid UUID', () => {
      const id = generateRecipeId();
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });

    it('generates unique IDs', () => {
      const id1 = generateRecipeId();
      const id2 = generateRecipeId();
      expect(id1).not.toBe(id2);
    });
  });
});
