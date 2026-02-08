import type { FastifyInstance } from 'fastify';
import type { Recipe } from '../../shared/recipe.js';
import type { FileRecipeRepository } from '../adapters/fileRecipeRepository.js';

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

  fastify.put<{ Params: { id: string }; Body: Recipe }>(
    '/api/recipes/:id',
    async (request, reply) => {
      try {
        const recipe = await repository.update({
          ...request.body,
          id: request.params.id,
        });
        return recipe;
      } catch {
        return reply.status(404).send({ error: 'Recipe not found' });
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/api/recipes/:id',
    async (request, reply) => {
      try {
        await repository.delete(request.params.id);
        return reply.status(204).send();
      } catch {
        return reply.status(404).send({ error: 'Recipe not found' });
      }
    }
  );
}
