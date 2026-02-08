import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server.js';
import { resetMockRecipes } from './mocks/handlers.js';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetMockRecipes();
});
afterAll(() => server.close());
