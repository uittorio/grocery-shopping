import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HttpRecipeWriter } from '../../http/httpRecipeWriter.js';
import type { Recipe } from '../../../domain/recipe.js';

const recipeWriter = new HttpRecipeWriter();

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: Recipe) => recipeWriter.create(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
