import { useQuery } from '@tanstack/react-query';
import { HttpRecipeReader } from '../../http/httpRecipeReader.js';

const recipeReader = new HttpRecipeReader();

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: () => recipeReader.findAll(),
  });
}
