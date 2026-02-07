import type { Recipe } from '../../domain/recipe.js';
import type { RecipeRepository } from '../../domain/ports/recipeRepository.js';

export class InMemoryRecipeRepository implements RecipeRepository {
  private recipes: Map<string, Recipe>;

  constructor(initialData: Recipe[] = []) {
    this.recipes = new Map();
    initialData.forEach(recipe => {
      this.recipes.set(recipe.id, recipe);
    });
  }

  async save(recipe: Recipe): Promise<Recipe> {
    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  async findById(id: string): Promise<Recipe | null> {
    return this.recipes.get(id) ?? null;
  }

  async findAll(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async search(query: string): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe => {
      if (recipe.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      return recipe.ingredients.some(ing =>
        ing.name.toLowerCase().includes(lowerQuery)
      );
    });
  }

  async delete(id: string): Promise<void> {
    this.recipes.delete(id);
  }
}
