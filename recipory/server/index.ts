import Fastify from 'fastify';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileRecipeRepository } from './adapters/fileRecipeRepository.js';
import { recipeRoutes } from './routes/recipes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const dataDir = join(projectRoot, process.env.RECIPE_DATA_DIR!);

const repository = new FileRecipeRepository(dataDir);

const server = Fastify({ logger: true });

server.register(recipeRoutes, { repository });

async function start() {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
