import type { RecipeReader } from './recipeReader.js';
import type { RecipeWriter } from './recipeWriter.js';

export interface RecipeRepository extends RecipeReader, RecipeWriter {}
