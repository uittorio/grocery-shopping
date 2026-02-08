import type { FastifyInstance } from 'fastify';
import type { Recipe } from '../../domain/recipe.js';
import type { FileRecipeRepository } from '../../adapters/server/fileRecipeRepository.js';

export async function recipeRoutes(
  fastify: FastifyInstance,
  opts: { repository: FileRecipeRepository }
) {
  const { repository } = opts;

  fastify.get('/api/recipes', async () => {
    return repository.findAll();
  });

  fastify.get<{ Params: { id: string } }>(
    '/api/recipes/:id',
    async (request, reply) => {
      const recipe = await repository.findById(request.params.id);
      if (!recipe) {
        return reply.status(404).send({ error: 'Recipe not found' });
      }
      return recipe;
    }
  );

  fastify.post<{ Body: Recipe }>('/api/recipes', async (request, reply) => {
    const recipe = await repository.create(request.body);
    return reply.status(201).send(recipe);
  });
}
