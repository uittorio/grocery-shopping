import { useQuery } from '@tanstack/react-query';
import { HttpRecipeReader } from '../../http/httpRecipeReader.js';

const recipeReader = new HttpRecipeReader();

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipes', id],
    queryFn: () => recipeReader.findById(id),
  });
}
