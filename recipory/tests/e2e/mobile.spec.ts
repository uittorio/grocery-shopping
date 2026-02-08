import { test, expect } from '@playwright/test';
import { resetTestData } from './helpers/resetTestData.js';

test.beforeEach(async () => {
  await resetTestData();
});

test.describe('Mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('recipe library on mobile', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Spaghetti Carbonara')).toBeVisible();
    await expect(page.getByText('Chicken Tikka Masala')).toBeVisible();

    await page.screenshot({ path: 'screenshots/06-mobile-library.png', fullPage: true });
  });

  test('add recipe form on mobile', async ({ page }) => {
    await page.goto('/recipes/new');

    await expect(page.getByText('New Recipe')).toBeVisible();
    await expect(page.getByLabel('Recipe Name')).toBeVisible();

    await page.screenshot({ path: 'screenshots/07-mobile-add-recipe.png', fullPage: true });
  });
});
