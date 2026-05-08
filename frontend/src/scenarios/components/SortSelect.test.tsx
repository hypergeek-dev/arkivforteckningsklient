import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for extended matchers
import SortSelect from './SortSelect';

const mockSetSortOrder = jest.fn();

const selectedValues = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const selected = 'asc';

describe('SortSelect', () => {
  test('renders correct number of options', () => {
    render(
      <SortSelect
        selectedValues={selectedValues}
        setSortOrder={mockSetSortOrder}
        selected={selected}
      />
    );

    // Open the dropdown
    fireEvent.mouseDown(screen.getByRole('combobox'));

    // Check the number of options
    expect(screen.getAllByRole('option')).toHaveLength(selectedValues.length);
  });

  test('calls setSortOrder on option select', () => {
    render(
      <SortSelect
        selectedValues={selectedValues}
        setSortOrder={mockSetSortOrder}
        selected={selected}
      />
    );

    // Open the dropdown
    fireEvent.mouseDown(screen.getByRole('combobox'));

    // Select an option
    fireEvent.click(screen.getByText('Descending'));

    // Check if the setSortOrder function was called with the correct value
    expect(mockSetSortOrder).toHaveBeenCalledWith('desc');
  });

  test('renders with correct initial selected value', () => {
    render(
      <SortSelect
        selectedValues={selectedValues}
        setSortOrder={mockSetSortOrder}
        selected={selected}
      />
    );

    // Check if the combobox has the correct initial value
    expect(screen.getByRole('combobox')).toHaveTextContent('Ascending');
  });
});
