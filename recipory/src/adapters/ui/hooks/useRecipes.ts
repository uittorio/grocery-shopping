import { useQuery } from '@tanstack/react-query';
import { fetchRecipes } from '../../http/recipesApi.js';

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });
}
