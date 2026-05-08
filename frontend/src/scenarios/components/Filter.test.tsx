import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filter, { FilterValue } from './Filter';

describe('Filter Component', () => {
  const handleChipSelet = jest.fn();
  const filterValues: FilterValue<string>[] = [
    { value: 'value1', label: 'Label 1' },
    { value: 'value2', label: 'Label 2' },
  ];
  const selectedFilter: string[] = ['value1'];

  test('renders Filter component', () => {
    render(
      <Filter
        filterValues={filterValues}
        handleChipSelet={handleChipSelet}
        selectedFilter={selectedFilter}
        columns={2}
      />
    );
    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2')).toBeInTheDocument();
  });

  test('calls handleChipSelet on chip click', () => {
    render(
      <Filter
        filterValues={filterValues}
        handleChipSelet={handleChipSelet}
        selectedFilter={selectedFilter}
        columns={2}
      />
    );
    fireEvent.click(screen.getByText('Label 1'));
    expect(handleChipSelet).toHaveBeenCalledWith('value1');
  });

  test('renders correct number of chips', () => {
    render(
      <Filter
        filterValues={filterValues}
        handleChipSelet={handleChipSelet}
        selectedFilter={selectedFilter}
        columns={2}
      />
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
