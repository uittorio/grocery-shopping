import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import type { Recipe } from '../../../shared/recipe.js';

export class FileRecipeRepository {
  constructor(private readonly dataDir: string) {}

  async findAll(): Promise<Recipe[]> {
    const ids = await this.readIndex();
    const recipes = await Promise.all(ids.map(id => this.findById(id)));
    return recipes.filter((r): r is Recipe => r !== null);
  }

  async findById(id: string): Promise<Recipe | null> {
    try {
      const filePath = join(this.dataDir, `${id}.json`);
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content) as Recipe;
    } catch {
      return null;
    }
  }

  async search(query: string): Promise<Recipe[]> {
    const recipes = await this.findAll();
    const lowerQuery = query.toLowerCase();
    return recipes.filter(recipe => {
      if (recipe.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      return recipe.ingredients.some(ing =>
        ing.name.toLowerCase().includes(lowerQuery)
      );
    });
  }

  async create(recipe: Recipe): Promise<Recipe> {
    await mkdir(this.dataDir, { recursive: true });

    const filePath = join(this.dataDir, `${recipe.id}.json`);
    await writeFile(filePath, JSON.stringify(recipe, null, 2));

    const ids = await this.readIndex();
    if (!ids.includes(recipe.id)) {
      ids.push(recipe.id);
      await this.writeIndex(ids);
    }

    return recipe;
  }

  async update(recipe: Recipe): Promise<Recipe> {
    const filePath = join(this.dataDir, `${recipe.id}.json`);
    try {
      await readFile(filePath, 'utf-8');
    } catch {
      throw new Error('Recipe not found');
    }
    await writeFile(filePath, JSON.stringify(recipe, null, 2));
    return recipe;
  }

  async delete(id: string): Promise<void> {
    const filePath = join(this.dataDir, `${id}.json`);
    try {
      await readFile(filePath, 'utf-8');
    } catch {
      throw new Error('Recipe not found');
    }
    await unlink(filePath);
    const ids = await this.readIndex();
    const updated = ids.filter(existingId => existingId !== id);
    await this.writeIndex(updated);
  }

  private async readIndex(): Promise<string[]> {
    try {
      const indexPath = join(this.dataDir, 'index.json');
      const content = await readFile(indexPath, 'utf-8');
      return JSON.parse(content) as string[];
    } catch {
      return [];
    }
  }

  private async writeIndex(ids: string[]): Promise<void> {
    const indexPath = join(this.dataDir, 'index.json');
    await writeFile(indexPath, JSON.stringify(ids, null, 2));
  }
}
