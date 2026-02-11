import { test, expect } from '@playwright/test';
import { resetTestData } from './helpers/resetTestData.js';

test.beforeEach(async () => {
  await resetTestData();
});

test.describe('Recipe Library', () => {
  test('displays recipes in the library', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Spaghetti Carbonara')).toBeVisible();
    await expect(page.getByText('Chicken Tikka Masala')).toBeVisible();

    const carbonaraCard = page.locator('.recipe-card', { hasText: 'Spaghetti Carbonara' });
    await expect(carbonaraCard.getByText('Serves 4 · 3 ingredients')).toBeVisible();

    const tikkaCard = page.locator('.recipe-card', { hasText: 'Chicken Tikka Masala' });
    await expect(tikkaCard.getByText('Serves 4 · 4 ingredients')).toBeVisible();

    await page.screenshot({ path: 'screenshots/01-recipe-library.png', fullPage: true });
  });

  test('creates a new recipe', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Add Recipe' }).click();
    await expect(page.getByText('New Recipe')).toBeVisible();

    await page.screenshot({ path: 'screenshots/02-add-recipe-form.png', fullPage: true });

    await page.getByLabel('Recipe Name').fill('Pasta Pesto');
    await page.getByLabel('Serves').fill('2');
    await page.getByLabel('Name', { exact: true }).fill('penne');
    await page.getByLabel('Quantity').fill('400');
    await page.getByLabel('Unit').fill('g');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Pasta Pesto')).toBeVisible();
    await expect(page.getByText('Spaghetti Carbonara')).toBeVisible();
    await expect(page.getByText('Chicken Tikka Masala')).toBeVisible();

    await page.screenshot({ path: 'screenshots/03-recipe-created.png', fullPage: true });
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/recipes/new');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Please fix the following errors:')).toBeVisible();
    await expect(page.locator('.validation-summary').getByText('Recipe name is required')).toBeVisible();
    await expect(page.locator('.validation-summary').getByText('Ingredient name is required')).toBeVisible();

    await page.screenshot({ path: 'screenshots/04-validation-errors.png', fullPage: true });
  });

  test('edits an existing recipe', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Spaghetti Carbonara/ }).click();
    await expect(page.getByText('Edit Recipe')).toBeVisible();
    await expect(page.getByLabel('Recipe Name')).toHaveValue('Spaghetti Carbonara');

    await page.screenshot({ path: 'screenshots/05-edit-recipe-form.png', fullPage: true });

    await page.getByLabel('Recipe Name').fill('Spaghetti Bolognese');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Spaghetti Bolognese')).toBeVisible();
    await expect(page.getByText('Spaghetti Carbonara')).not.toBeVisible();
  });

  test('deletes a recipe', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());

    await page.goto('/');
    await expect(page.getByText('Spaghetti Carbonara')).toBeVisible();

    await page.getByRole('link', { name: /Spaghetti Carbonara/ }).click();
    await expect(page.getByText('Edit Recipe')).toBeVisible();

    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('Chicken Tikka Masala')).toBeVisible();
    await expect(page.getByText('Spaghetti Carbonara')).not.toBeVisible();
  });

  test('navigates back to library when clicking Cancel', async ({ page }) => {
    await page.goto('/recipes/new');

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByText('Recipe Library')).toBeVisible();
    await expect(page.getByText('Spaghetti Carbonara')).toBeVisible();
  });

  test('adds and removes ingredient rows', async ({ page }) => {
    await page.goto('/recipes/new');

    await expect(page.getByLabel('Name', { exact: true })).toHaveCount(1);

    await page.getByRole('button', { name: '+ Add Ingredient' }).click();
    await expect(page.getByLabel('Name', { exact: true })).toHaveCount(2);

    await page.getByRole('button', { name: 'Remove' }).first().click();
    await expect(page.getByLabel('Name', { exact: true })).toHaveCount(1);
  });
});
