import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChipSelect, { SimpleChipSelect } from './ChipSelect';

describe('ChipSelect Component', () => {
  const handleChipSelect = jest.fn();

  test('renders ChipSelect component', () => {
    render(
      <ChipSelect
        active={false}
        handleChipSelect={handleChipSelect}
        label="Test Chip"
        title="Test Title"
      />
    );
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
    expect(screen.getByTitle('Test Title')).toBeInTheDocument();
  });

  test('calls handleChipSelect on click', () => {
    render(
      <ChipSelect
        active={false}
        handleChipSelect={handleChipSelect}
        label="Test Chip"
        title="Test Title"
      />
    );
    fireEvent.click(screen.getByText('Test Chip'));
    expect(handleChipSelect).toHaveBeenCalledTimes(1);
  });

  test('displays Done icon when active', () => {
    render(
      <ChipSelect
        active={true}
        handleChipSelect={handleChipSelect}
        label="Test Chip"
        title="Test Title"
      />
    );
    expect(screen.getByTestId('DoneIcon')).toBeInTheDocument();
  });

  test('displays Circle icon when not active', () => {
    render(
      <ChipSelect
        active={false}
        handleChipSelect={handleChipSelect}
        label="Test Chip"
        title="Test Title"
      />
    );
    expect(screen.getByTestId('CircleIcon')).toBeInTheDocument();
  });

  describe('SimpleChipSelect Component', () => {
    const handleChipSelect = jest.fn();

    test('renders SimpleChipSelect component', () => {
      render(
        <SimpleChipSelect
          active={false}
          handleChipSelect={handleChipSelect}
          label="Simple Chip"
          title="Simple Title"
        />
      );
      expect(screen.getByText('Simple Chip')).toBeInTheDocument();
      expect(screen.getByTitle('Simple Title')).toBeInTheDocument();
    });

    test('calls handleChipSelect on click', () => {
      render(
        <SimpleChipSelect
          active={false}
          handleChipSelect={handleChipSelect}
          label="Simple Chip"
          title="Simple Title"
        />
      );
      fireEvent.click(screen.getByText('Simple Chip'));
      expect(handleChipSelect).toHaveBeenCalledTimes(1);
    });
  });
});
