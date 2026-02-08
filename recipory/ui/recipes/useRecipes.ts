import { useQuery } from '@tanstack/react-query';
import { HttpRecipeReader } from '../adapters/httpRecipeReader.js';

const recipeReader = new HttpRecipeReader();

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: () => recipeReader.findAll(),
  });
}
