import { cp, rm, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, '..', 'fixtures', 'recipes');
const testDataDir = join(__dirname, '..', '..', '..', 'data', 'test-recipes');

export async function resetTestData() {
  await rm(testDataDir, { recursive: true, force: true });
  await mkdir(testDataDir, { recursive: true });
  await cp(fixturesDir, testDataDir, { recursive: true });
}
