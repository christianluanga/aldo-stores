import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShoeCard from '../src/components/ShoeCard';

const LOW_STOCK = 50

const shoe = {
  guid: 'xxxx',
  id: 1,
  model: 'Test Shoe',
  inventory: 10,
};

const handleSubmit = jest.fn();

describe('ShoeCard Component', () => {
  beforeEach(() => {
    render(<ShoeCard shoe={shoe} handleSubmit={handleSubmit} />);
  });

  test('renders the component', () => {
    const img = screen.getByAltText('Test Shoe');
    expect(img).toBeInTheDocument();
    expect(screen.getByText(`${shoe.inventory} in stock`)).toBeInTheDocument();
  });

  test('increments shoe count', () => {
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);
    const input = screen.getByDisplayValue('1');
    expect(input).toBeInTheDocument();
  });

  test('decrements shoe count', () => {
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    const removeButton = screen.getByText('-');
    fireEvent.click(removeButton);
    const input = screen.getByDisplayValue('1');
    expect(input).toBeInTheDocument();
  });

  test('prevents incrementing beyond inventory', () => {
    const addButton = screen.getByText('+');
    for (let i = 0; i < shoe.inventory + 1; i++) {
      fireEvent.click(addButton);
    }
    const input = screen.getByDisplayValue(`${shoe.inventory}`);
    expect(input).toBeInTheDocument();
  });

  test('prevents decrementing below 0', () => {
    const removeButton = screen.getByText('-');
    fireEvent.click(removeButton);
    const input = screen.getByDisplayValue('0');
    expect(input).toBeInTheDocument();
  });

  test('changes input value', () => {
    const input = screen.getByDisplayValue('0');
    fireEvent.change(input, { target: { value: '5' } });
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('prevents input value beyond inventory', () => {
    const input = screen.getByDisplayValue('0');
    fireEvent.change(input, { target: { value: '15' } });
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  test('handles submit', () => {
    const input = screen.getByDisplayValue('0');
    fireEvent.change(input, { target: { value: '2' } });
    const buyButton = screen.getByText('Buy');
    fireEvent.click(buyButton);
    expect(handleSubmit).toHaveBeenCalledWith({ shoeId: shoe.id, quantity: 2 });
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  test('displays low stock warning', () => {
    const lowStockShoe = { ...shoe, inventory: LOW_STOCK - 1 };
    render(<ShoeCard shoe={lowStockShoe} handleSubmit={handleSubmit} />);
    expect(screen.getByText(`${lowStockShoe.inventory} in stock`)).toHaveClass('bg-red-500');
  });
});
