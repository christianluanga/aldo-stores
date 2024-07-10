import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StoreCard from '../src/components/StoreCard';

const store = {
  guid: '1234-5678-9012',
  id: 1,
  name: 'Test Store',
};

describe('StoreCard Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <StoreCard store={store} />
      </Router>
    );
  });

  test('renders the store image', () => {
    const img = screen.getByAltText('Test Store');
    expect(img).toBeInTheDocument();
    const expectedUrl = `https://placehold.co/400x300?text=${encodeURIComponent(store.name)}`;
    expect(img).toHaveAttribute('src', expectedUrl);
  });

  test('renders the store name', () => {
    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });

  test('renders the correct link', () => {
    const link = screen.getByRole('link', { name: /test store/i });
    expect(link).toHaveAttribute('href', `/store/${store.guid}`);
  });

  test('link contains correct state', () => {
    const link = screen.getByRole('link', { name: /test store/i });
    expect(link).toHaveAttribute('href', `/store/${store.guid}`);
  });
});
