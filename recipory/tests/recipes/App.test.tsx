import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '../../ui/src/App.js';

function renderApp(initialRoute = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe('App', () => {
  describe('Recipe Library', () => {
    it('displays recipes when loaded', async () => {
      renderApp();

      expect(await screen.findByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText('3 ingredients')).toBeInTheDocument();
    });

    it('shows an Add Recipe button', async () => {
      renderApp();

      expect(await screen.findByRole('link', { name: 'Add Recipe' })).toBeInTheDocument();
    });
  });

  describe('Add Recipe', () => {
    it('navigates to recipe form when clicking Add Recipe', async () => {
      const user = userEvent.setup();
      renderApp();

      const addButton = await screen.findByRole('link', { name: 'Add Recipe' });
      await user.click(addButton);

      expect(screen.getByText('New Recipe')).toBeInTheDocument();
      expect(screen.getByLabelText('Recipe Name')).toBeInTheDocument();
    });

    it('shows validation errors when submitting empty form', async () => {
      const user = userEvent.setup();
      renderApp('/recipes/new');

      const nameInput = screen.getByLabelText('Recipe Name');
      expect(nameInput).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(await screen.findByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument();
      expect(screen.getAllByText('Recipe name is required').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Ingredient name is required').length).toBeGreaterThanOrEqual(1);
    });

    it('shows validation error when no ingredients exist', async () => {
      const user = userEvent.setup();
      renderApp('/recipes/new');

      await user.click(screen.getByRole('button', { name: 'Remove' }));
      await user.type(screen.getByLabelText('Recipe Name'), 'Test Recipe');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(await screen.findByRole('alert')).toBeInTheDocument();
      expect(screen.getAllByText('At least one ingredient is required').length).toBeGreaterThanOrEqual(1);
    });

    it('creates a recipe and navigates back to library', async () => {
      const user = userEvent.setup();
      renderApp('/recipes/new');

      await user.type(screen.getByLabelText('Recipe Name'), 'Pasta Pesto');
      await user.type(screen.getByLabelText('Name'), 'penne');
      await user.type(screen.getByLabelText('Quantity'), '400');
      await user.type(screen.getByLabelText('Unit'), 'g');

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(await screen.findByText('Pasta Pesto')).toBeInTheDocument();
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    });

    it('navigates back to library when clicking Cancel', async () => {
      const user = userEvent.setup();
      renderApp('/recipes/new');

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(await screen.findByText('Spaghetti Carbonara')).toBeInTheDocument();
    });

    it('adds and removes ingredient rows', async () => {
      const user = userEvent.setup();
      renderApp('/recipes/new');

      expect(screen.getAllByLabelText('Name')).toHaveLength(1);

      await user.click(screen.getByRole('button', { name: 'Add Ingredient' }));
      expect(screen.getAllByLabelText('Name')).toHaveLength(2);

      const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
      await user.click(removeButtons[0]!);
      expect(screen.getAllByLabelText('Name')).toHaveLength(1);
    });
  });

  describe('Edit Recipe', () => {
    async function navigateToEditRecipe() {
      const user = userEvent.setup();
      renderApp();

      const recipeCard = await screen.findByRole('link', { name: /Spaghetti Carbonara/i });
      await user.click(recipeCard);
      await screen.findByText('Edit Recipe');

      return user;
    }

    it('recipe cards are clickable and navigate to edit form', async () => {
      await navigateToEditRecipe();

      expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
    });

    it('pre-populates the form with existing recipe data', async () => {
      await navigateToEditRecipe();

      expect(screen.getByLabelText('Recipe Name')).toHaveValue('Spaghetti Carbonara');

      const ingredientNames = screen.getAllByLabelText('Name');
      expect(ingredientNames[0]).toHaveValue('spaghetti');
      expect(ingredientNames[1]).toHaveValue('eggs');
      expect(ingredientNames[2]).toHaveValue('parmesan');
    });

    it('edits a recipe and saves changes', async () => {
      const user = await navigateToEditRecipe();

      const nameInput = screen.getByLabelText('Recipe Name');
      await user.clear(nameInput);
      await user.type(nameInput, 'Spaghetti Bolognese');

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(await screen.findByText('Spaghetti Bolognese')).toBeInTheDocument();
    });

    it('shows validation error when editing recipe name to empty', async () => {
      const user = await navigateToEditRecipe();

      const nameInput = screen.getByLabelText('Recipe Name');
      await user.clear(nameInput);

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(await screen.findByRole('alert')).toBeInTheDocument();
      expect(screen.getAllByText('Recipe name is required').length).toBeGreaterThanOrEqual(1);
    });

    it('navigates back to library when clicking Cancel', async () => {
      const user = await navigateToEditRecipe();

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(await screen.findByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Recipe Library')).toBeInTheDocument();
    });

    it('deletes a recipe after confirmation', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const user = await navigateToEditRecipe();

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete "Spaghetti Carbonara"?');
      expect(await screen.findByText('Your Recipe Library is Empty')).toBeInTheDocument();

      confirmSpy.mockRestore();
    });

    it('keeps recipe when delete confirmation is cancelled', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const user = await navigateToEditRecipe();

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(confirmSpy).toHaveBeenCalled();
      expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
      expect(screen.getByLabelText('Recipe Name')).toHaveValue('Spaghetti Carbonara');

      confirmSpy.mockRestore();
    });
  });
});
