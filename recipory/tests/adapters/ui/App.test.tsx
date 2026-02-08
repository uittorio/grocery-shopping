import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '../../../src/adapters/ui/App.js';

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

      expect(await screen.findByText('Recipe name is required')).toBeInTheDocument();
      expect(screen.getByText('Ingredient name is required')).toBeInTheDocument();
    });

    it('shows validation error when no ingredients exist', async () => {
      const user = userEvent.setup();
      renderApp('/recipes/new');

      await user.click(screen.getByRole('button', { name: 'Remove' }));
      await user.type(screen.getByLabelText('Recipe Name'), 'Test Recipe');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(await screen.findByText('At least one ingredient is required')).toBeInTheDocument();
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
});
