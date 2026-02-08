import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HttpRecipeWriter } from '../adapters/httpRecipeWriter.js';
import type { Recipe } from '../../shared/recipe.js';

const recipeWriter = new HttpRecipeWriter();

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: Recipe) => recipeWriter.update(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
