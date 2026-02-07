import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '../../../src/adapters/ui/App.js';

describe('App', () => {
  it('displays recipes when loaded', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Spaghetti Carbonara')).toBeInTheDocument();
    expect(screen.getByText('3 ingredients')).toBeInTheDocument();
  });
});
