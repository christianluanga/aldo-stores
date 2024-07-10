import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Banner from '../src/components/LowStockBanner';

describe('Banner Component', () => {
  const mockHandleClick = jest.fn();
  const lowCountItems = [
    { id: 1, model: 'Nike Air', inventory: 3 },
    { id: 2, model: 'Adidas Boost', inventory: 2 },
  ];

  beforeEach(() => {
    render(<Banner lowCountItems={lowCountItems} handleClick={mockHandleClick} />);
  });

  test('renders the correct alert text', () => {
    expect(screen.getByText(/ALERT!/i)).toBeInTheDocument();
  });

  test('displays the correct number of low inventory items', () => {
    expect(screen.getByText(/2 shoes are running low on inventory./i)).toBeInTheDocument();
  });

  test('calls handleClick when button is clicked', () => {
    const button = screen.getByText(/SHOW ME !/i);
    fireEvent.click(button);
    expect(mockHandleClick).toHaveBeenCalled();
  });

  test('displays singular text for one low inventory item', () => {
    render(<Banner lowCountItems={[{ id: 1, model: 'Nike Air', inventory: 3 }]} handleClick={mockHandleClick} />);
    expect(screen.getByText(/1 shoe is running low on inventory./i)).toBeInTheDocument();
  });
});
