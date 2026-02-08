import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HttpRecipeWriter } from '../adapters/httpRecipeWriter.js';

const recipeWriter = new HttpRecipeWriter();

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recipeWriter.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
